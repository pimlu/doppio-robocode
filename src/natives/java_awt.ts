import * as JVMTypes from '../../includes/JVMTypes';
import * as Doppio from '../doppiojvm';
import JVMThread = Doppio.VM.Threading.JVMThread;
import ReferenceClassData = Doppio.VM.ClassFile.ReferenceClassData;
import logging = Doppio.Debug.Logging;
import util = Doppio.VM.Util;
import Long = Doppio.VM.Long;
import ClassData = Doppio.VM.ClassFile.ClassData;
import ThreadStatus = Doppio.VM.Enums.ThreadStatus;

export default function (): any {
  class javax_swing_JFrame {

    public static 'init()V'(thread: JVMThread): void {
        console.log("@stu jframe");
        // NOP
    }
  }

  class classes_awt_CanvasGraphicsEnvironment {

  }

  class classes_awt_BrowserCanvas {
    canvas: HTMLCanvasElement;

    public static 'init()V'(thread: JVMThread, javaThis: classes_awt_BrowserCanvas): void {
      let c = document.createElement('canvas');

      javaThis.canvas = c;
    }
    public static 'resize(II)V'(thread: JVMThread, javaThis: classes_awt_BrowserCanvas, width: number, height: number): void {
      let c = javaThis.canvas;
      c.width = width;
      c.height = height;
    }

    public static 'mount()V'(thread: JVMThread, javaThis: classes_awt_BrowserCanvas): void {
      document.body.appendChild(javaThis.canvas);
    }
    public static 'width()I'(thread: JVMThread, javaThis: classes_awt_BrowserCanvas): number {
      return javaThis.canvas.width;
    }
    public static 'height()I'(thread: JVMThread, javaThis: classes_awt_BrowserCanvas): number {
      return javaThis.canvas.height;
    }
  }

  const g2dCanvas = 'classes/awt/CanvasGraphics2D/canvas'

  // from BufferedImage. Converted to strings because old typescript seems to need this for records
  const TYPE_INT_RGB = '1',
    TYPE_INT_ARGB = '2',
    TYPE_3BYTE_BGR = '5',
    TYPE_4BYTE_ABGR = '6',
    // this one is made up
    TYPE_CANVAS_RGBA = '999';

  type ConversionMap = Record<string, (src: Uint8Array) => Uint8Array>;
  // this silly cast is needed for old typescript
  const normalizers: ConversionMap = {
    // this is used for painting the ground/battlefield overall
    [TYPE_INT_RGB]: (src: Uint8Array) => {
      let dst = new Uint8Array(src.length);
      for (let i=0; i<src.length; i += 4) {
        // dst is RGBA, src is _RGB
        dst[i+0] = src[i+2];
        dst[i+1] = src[i+1];
        dst[i+2] = src[i+0];
        dst[i+3] = 255;
      }
      return dst;
    },
    // this one is crucial because it's the default BufferedImage layout
    [TYPE_INT_ARGB]: (src: Uint8Array) => {
        let dst = new Uint8Array(src.length);
        for (let i=0; i<src.length; i += 4) {
          // dst is RGBA, src is ARGB
          dst[i+0] = src[i+2];
          dst[i+1] = src[i+1];
          dst[i+2] = src[i+0];
          dst[i+3] = src[i+3];
        }
        return dst;
    },
    // this one is used for painting individual tiles of the battlefield
    [TYPE_3BYTE_BGR]: (src: Uint8Array) => {
      let pixels = src.length/3;
      let dst = new Uint8Array(pixels * 4);
      for (let p=0; p<pixels; p++) {
        let i = p*4, j = p*3;
        // dst is RGBA, src is BGR (no 4th byte)
        dst[i+0] = src[j+2];
        dst[i+1] = src[j+1];
        dst[i+2] = src[j+0];
        dst[i+3] = 255;
      }
      return dst;
    },
    // this one is used for the tank bodies
    [TYPE_4BYTE_ABGR]: (src: Uint8Array) => {
      let dst = new Uint8Array(src.length);
      for (let i=0; i<src.length; i += 4) {
        // dst is RGBA, src is ABGR
        dst[i+0] = src[i+3];
        dst[i+1] = src[i+2];
        dst[i+2] = src[i+1];
        dst[i+3] = src[i+0];
      }
      return dst;
    },
    [TYPE_CANVAS_RGBA]: (src: Uint8Array) => new Uint8Array(src)
  } as ConversionMap;
  function convertToRGBA(srcType: string, src: Uint8Array): Uint8Array {
    if (!(srcType in normalizers)) {
      throw new Error(`can't convert from unsupported image type ${srcType}`);
    }
    return normalizers[srcType](src);
  }
  const denormalizers: ConversionMap = {
    [TYPE_INT_ARGB]: (src: Uint8Array) => {
      let dst = new Uint8Array(src.length);
      for (let i=0; i<src.length; i += 4) {
        // dst is ARGB, src is RGBA
        dst[i+0] = src[i+2];
        dst[i+1] = src[i+1];
        dst[i+2] = src[i+0];
        dst[i+3] = src[i+3];
      }
      return dst;
    },
    [TYPE_4BYTE_ABGR]: (src: Uint8Array) => {
      throw new Error("converting image to ABGR is not supported");
    },
    [TYPE_CANVAS_RGBA]: (src: Uint8Array) => new Uint8Array(src)
  } as ConversionMap;
  function convertFromRGBA(dstType: string, src: Uint8Array): Uint8Array {
    if (!(dstType in denormalizers)) {
      throw new Error(`can't convert to unsupported image type ${dstType}`);
    }
    return denormalizers[dstType](src);
  }
  function convertImageBuffer(srcType: string, dstType: string, src: Uint8Array): Uint8Array {
    let rgbaBuffer = convertToRGBA(srcType, src);
    let dst = convertFromRGBA(dstType, rgbaBuffer);
    return dst;
  }
  function byteCopy(src: Uint8Array, dst: Uint8Array) {
    if (src.length !== dst.length) {
      throw new Error("byteCopy expected same length buffers")
    }
    for (let i=0; i<src.length; i++) {
      dst[i] = src[i];
    }
  }

  function setFont(ctx: CanvasRenderingContext2D, font: JVMTypes.java_awt_Font) {
    let size = font['java/awt/Font/pointSize'];
    ctx.font =`${size}px sans-serif`;
  }

  function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    let rx = w / 2, ry = h / 2;
    let cx = x + rx, cy = y + ry

    ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
  }

  interface DataBufferInt {
    'java/awt/image/DataBufferInt/data': { array: Int32Array }
  }
  

  class classes_awt_CanvasGraphics2D {
    'classes/awt/CanvasGraphics2D/paint': JVMTypes.java_awt_Color;
    'classes/awt/CanvasGraphics2D/font': JVMTypes.java_awt_Font;
    'classes/awt/CanvasGraphics2D/tf': JVMTypes.java_awt_geom_AffineTransform;
    'classes/awt/CanvasGraphics2D/canvas': classes_awt_BrowserCanvas;
    ctx: CanvasRenderingContext2D;
    'classes/awt/CanvasGraphics2D/postDrawSync': JVMTypes.java_lang_Runnable;

    public static 'init()V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D): void {
      javaThis.ctx = javaThis[g2dCanvas].canvas.getContext('2d');
    }

    public static 'beginPath()V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D): void {
      javaThis.ctx.beginPath();
    }
    public static 'moveTo(DD)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, x: number, y: number): void {
      javaThis.ctx.moveTo(x, y);
    }
    public static 'lineTo(DD)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, x: number, y: number): void {
      javaThis.ctx.lineTo(x, y);
    }
    public static 'quadTo(DDDD)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, a: number, b: number, c: number, d: number): void {
      javaThis.ctx.quadraticCurveTo(a, b, c, d);
    }
    public static 'cubicTo(DDDDDD)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, a: number, b: number, c: number, d: number, e: number, f: number): void {
      javaThis.ctx.bezierCurveTo(a, b, c, d, e, f);
    }
    public static 'doStroke()V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D): void {
      javaThis.ctx.stroke();
    }
    public static 'doFill()V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D): void {
      javaThis.ctx.fill();
    }


    public static 'syncTransform()V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D): void {
      let tf = javaThis['classes/awt/CanvasGraphics2D/tf'];

      let target = {
        m11: tf['java/awt/geom/AffineTransform/m00'],
        m12: tf['java/awt/geom/AffineTransform/m10'],
        m21: tf['java/awt/geom/AffineTransform/m01'],
        m22: tf['java/awt/geom/AffineTransform/m11'],
  
        m41: tf['java/awt/geom/AffineTransform/m02'],
        m42: tf['java/awt/geom/AffineTransform/m12'],
      };

      
      (javaThis.ctx.setTransform as any)(target);
    }

    public static 'setColorImpl(IIII)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, r: number, g: number, b: number, a: number): void {
      let {ctx} = javaThis;

      let dump = (b: number) => {
        let s = b.toString(16);
        while (s.length < 2) s = '0'+s;
        return s;
      }
      let color = '#' + [r,g,b,a].map(dump).join('');
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
    }


    public static 'writeARGB(Ljava/awt/image/BufferedImage;)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, image: JVMTypes.java_awt_image_BufferedImage): void {
      let buffer = image['java/awt/image/BufferedImage/raster']['java/awt/image/Raster/dataBuffer'];
      let dstBuf = (buffer as any as DataBufferInt)['java/awt/image/DataBufferInt/data'].array;
      let dst = new Uint8Array(dstBuf.buffer, dstBuf.byteOffset, dstBuf.byteLength);

      let {canvas} = javaThis[g2dCanvas];
      let src = javaThis.ctx.getImageData(0,0, canvas.width, canvas.height).data;

      let res = convertFromRGBA(TYPE_INT_ARGB, src);
      byteCopy(res, dst);
    }
    public static 'clearRect(IIII)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, x: number, y: number, width: number, height: number): void {
      javaThis.ctx.clearRect(x, y, width, height);
    }

    public static 'drawLine(IIII)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, x1: number, y1: number, x2: number, y2: number): void {
      let {ctx} = javaThis;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    public static 'drawOval(IIII)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, x: number, y: number, w: number, h: number): void {
      let {ctx} = javaThis;

      ctx.beginPath();
      ellipse(ctx, x, y, w, h);
      ctx.stroke();
    }

    public static 'drawImage(Ljava/awt/Image;IIIILjava/awt/Color;Ljava/awt/image/ImageObserver;)Z'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, image: JVMTypes.java_awt_Image, x: number, y: number, w: number, h: number, bgColor: JVMTypes.java_awt_Color, o: JVMTypes.java_awt_image_ImageObserver): boolean {
      if (!image) {
        // spec says it does nothing and returns true when image is null
        return true;
      }
  
      const bufImg = image as any as JVMTypes.java_awt_image_BufferedImage;

      let raster = bufImg['java/awt/image/BufferedImage/raster'];
      if (!raster) {
        console.log("@stu bad raster from image:", image);
        thread.throwNewException('Ljava/lang/UnsupportedOperationException;', 'Couldn\'t find the raster field (doppio\'s drawImage() only supports BufferedImages)');
        return true;
      }

      // let colorModel = bufImg['java/awt/image/BufferedImage/colorModel'];
      let imageType = bufImg['java/awt/image/BufferedImage/imageType'];

      let buffer = raster['java/awt/image/Raster/dataBuffer'] as any;

      let srcBufData = buffer['java/awt/image/DataBufferInt/data'] || buffer['java/awt/image/DataBufferByte/data'];
      if (!srcBufData) {
        console.log("couldn't find buffer", srcBufData);
        thread.throwNewException('Ljava/lang/UnsupportedOperationException;', `Couldn't find array buffer data`);
        return true;
      }
      // could be other types of integers but I just want code hints lol
      let srcBuf = srcBufData.array as Uint8Array;
      let src = new Uint8Array(srcBuf.buffer, srcBuf.byteOffset, srcBuf.byteLength);

      let width = raster['java/awt/image/Raster/width'];
      let height = raster['java/awt/image/Raster/height'];


      let dst: Uint8ClampedArray;
      try {
        // TODO there is probably more to check with the colorModel
        dst = new Uint8ClampedArray(convertToRGBA(''+imageType, src));
      } catch(e) {
        console.error(e);
        thread.throwNewException('Ljava/lang/UnsupportedOperationException;', `Failed to convert from the image type ${imageType}: ${e}`);
        return true;
      }

      let old = javaThis.ctx.strokeStyle;
      javaThis.ctx.strokeStyle = 'white';
      classes_awt_CanvasGraphics2D['drawOval(IIII)V'](thread, javaThis, x,y,w,h);
      javaThis.ctx.strokeStyle = old;

      let imgData = new ImageData(dst, width, height);
      thread.setStatus(ThreadStatus.ASYNC_WAITING);
      (window as any).createImageBitmap(imgData).then((bitmap: any) => {
        try {
          javaThis.ctx.drawImage(bitmap, x, y, w, h);
  
          thread.asyncReturn(1);
        } finally {
          bitmap.close();
        }
      }).catch((err: Error) => {
        thread.throwNewException('Ljava/lang/Exception;', `failed to write bitmap: ${err}`);
      });

      // I think this doesn't do anything but satisfy typescript?
      return true;
    }

    public static 'setFontImpl()V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D): void {
      setFont(javaThis.ctx, javaThis['classes/awt/CanvasGraphics2D/font']);
    }

    public static 'drawString(Ljava/lang/String;FF)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, str: JVMTypes.java_lang_String, x: number, y: number): void {
      let jsStr = str.toString();
      javaThis.ctx.fillText(jsStr, x, y);
    }

    public static 'fillRect(IIII)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, x: number, y: number, w: number, h: number): void {
      javaThis.ctx.fillRect(x, y, w, h);
    }

    public static 'filOval(IIII)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, x: number, y: number, w: number, h: number): void {
      let {ctx} = javaThis;

      ctx.beginPath();
      ellipse(ctx, x, y, w, h);
      ctx.fill();
    }


  }

  class classes_awt_BrowserFontMetrics {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    limits: TextMetrics;
    'java/awt/FontMetrics/font': JVMTypes.java_awt_Font;

    public static 'init()V'(thread: JVMThread, javaThis: classes_awt_BrowserFontMetrics): void {
      javaThis.canvas = document.createElement('canvas');
      let ctx = javaThis.canvas.getContext('2d');;
      javaThis.ctx = ctx;
      setFont(ctx, javaThis['java/awt/FontMetrics/font']);

      let az = 'abcdefghijklmnopqrstuvwxyz';
      javaThis.limits = ctx.measureText(`1234567890 ${az} ${az.toUpperCase()}`);
    }
    public static 'getAscent()I'(thread: JVMThread, javaThis: classes_awt_BrowserFontMetrics): number {
      return (javaThis.limits as any).actualBoundingBoxAscent | 0;
    }
    public static 'getDescent()I'(thread: JVMThread, javaThis: classes_awt_BrowserFontMetrics): number {
      return (javaThis.limits as any).actualBoundingBoxDescent | 0;
    }
    public static 'stringWidth(Ljava/lang/String;)I'(thread: JVMThread, javaThis: classes_awt_BrowserFontMetrics, str: JVMTypes.java_lang_String): number {
      let jsStr = str.toString();
      let measurement = javaThis.ctx.measureText(jsStr);
      return measurement.width | 0;
    }

  }


  // Export line. This is what DoppioJVM sees.
  return {
    'javax/swing/JFrame': javax_swing_JFrame,
    'classes/awt/CanvasGraphicsEnvironment': classes_awt_CanvasGraphicsEnvironment,
    'classes/awt/BrowserCanvas': classes_awt_BrowserCanvas,
    'classes/awt/CanvasGraphics2D': classes_awt_CanvasGraphics2D,
    'classes/awt/BrowserFontMetrics': classes_awt_BrowserFontMetrics,
  };
};
