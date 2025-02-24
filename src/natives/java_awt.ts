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

  function sync(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, rv?: any) {
    const postDrawSync = javaThis['classes/awt/CanvasGraphics2D/postDrawSync'];
    if (!postDrawSync) {
      return;
    }
    if (typeof rv === 'boolean') {
      rv = Number(rv);
    }
    postDrawSync['run()V'](thread, [], (e?: JVMTypes.java_lang_Throwable) => {
      if (e) {
        thread.throwException(e);
      } else {
        thread.asyncReturn(rv);
      }
    });
  }

  // from BufferedImage. Converted to strings because old typescript seems to need this for records
  const TYPE_INT_ARGB = '2',
    TYPE_4BYTE_ABGR = '6',
    // this one is made up
    TYPE_CANVAS_RGBA = '999';
  type ImageType = typeof TYPE_INT_ARGB | typeof TYPE_4BYTE_ABGR | typeof TYPE_CANVAS_RGBA;

  type ConversionMap = Record<ImageType, (src: Uint8Array) => Uint8Array>;
  // this silly cast is needed for old typescript
  const normalizers: ConversionMap = {
    [TYPE_INT_ARGB]: (src: Uint8Array) => {
        let dst = new Uint8Array(src.length);
        for (let i=0; i<src.length; i += 4) {
          // dst is RGBA, src is ARGB
          dst[i+0] = src[i+1];
          dst[i+1] = src[i+2];
          dst[i+2] = src[i+3];
          dst[i+3] = src[i+0];
        }
        return dst;
    },
    [TYPE_4BYTE_ABGR]: (src: Uint8Array) => {
      let dst = new Uint8Array(src.length);
      for (let i=0; i<src.length; i += 4) {
        // dst is ABGR, src is ARGB
        dst[i+0] = src[i+0];
        dst[i+1] = src[i+3];
        dst[i+2] = src[i+2];
        dst[i+3] = src[i+1];
      }
      return dst;
    },
    [TYPE_CANVAS_RGBA]: (src: Uint8Array) => new Uint8Array(src)
  } as ConversionMap;
  function convertToRGBA(srcType: string, src: Uint8Array): Uint8Array {
    if (!(srcType in normalizers)) {
      throw new Error(`can't convert from unknown image type ${srcType}`);
    }
    return normalizers[srcType as ImageType](src);
  }
  const denormalizers: ConversionMap = {
    [TYPE_INT_ARGB]: (src: Uint8Array) => {
      let dst = new Uint8Array(src.length);
      for (let i=0; i<src.length; i += 4) {
        // dst is ARGB, src is RGBA
        dst[i+0] = src[i+3];
        dst[i+1] = src[i+0];
        dst[i+2] = src[i+1];
        dst[i+3] = src[i+2];
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
      throw new Error(`can't convert to unknown image type ${dstType}`);
    }
    return denormalizers[dstType as ImageType](src);
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

  interface DataBufferInt {
    'java/awt/image/DataBufferInt/data': { array: Int32Array }
  }
  

  class classes_awt_CanvasGraphics2D {
    'classes/awt/CanvasGraphics2D/canvas': classes_awt_BrowserCanvas;
    ctx: CanvasRenderingContext2D;
    'classes/awt/CanvasGraphics2D/postDrawSync': JVMTypes.java_lang_Runnable;

    public static 'init()V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D): void {
      javaThis.ctx = javaThis[g2dCanvas].canvas.getContext('2d');
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
      sync(thread, javaThis);
    }
    public static 'drawOval(IIII)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, x: number, y: number, width: number, height: number): void {
      let {ctx} = javaThis;

      let rx = width / 2, ry = height / 2;
      let cx = x + rx, cy = y + ry

      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
      ctx.stroke();

      sync(thread, javaThis);
    }

    public static 'drawImage(Ljava/awt/Image;IILjava/awt/image/ImageObserver;)Z'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, image: JVMTypes.java_awt_Image, x: number, y: number, o: JVMTypes.java_awt_image_ImageObserver): boolean {
      if (!image) {
        // spec says it does nothing and returns true when image is null
        return true;
      }
  
      const bufImg = image as any as JVMTypes.java_awt_image_BufferedImage;

      let raster = bufImg['java/awt/image/BufferedImage/raster'];
      if (!raster) {
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

      let imgData = new ImageData(dst, width, height);

      javaThis.ctx.putImageData(imgData, x, y);

      sync(thread, javaThis, true);
      return true;
    }
  }


  // Export line. This is what DoppioJVM sees.
  return {
    'javax/swing/JFrame': javax_swing_JFrame,
    'classes/awt/CanvasGraphicsEnvironment': classes_awt_CanvasGraphicsEnvironment,
    'classes/awt/BrowserCanvas': classes_awt_BrowserCanvas,
    'classes/awt/CanvasGraphics2D': classes_awt_CanvasGraphics2D
  };
};
