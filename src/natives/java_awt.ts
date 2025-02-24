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
    console.log(javaThis);
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

  function convertToARGB(src: Uint8ClampedArray, dst: Uint8Array) {
    for (let i=0; i<src.length; i += 4) {
      // dst is ARGB, src is RGBA
      dst[i+0] = src[i+3];
      dst[i+1] = src[i+0];
      dst[i+2] = src[i+1];
      dst[i+3] = src[i+2];
    }
  }
  function convertToRGBA(src: Uint8ClampedArray, dst: Uint8Array) {
    for (let i=0; i<src.length; i += 4) {
      // dst is RGBA, src is ARGB
      dst[i+0] = src[i+1];
      dst[i+1] = src[i+2];
      dst[i+2] = src[i+3];
      dst[i+3] = src[i+0];
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
      let dst = new Uint8Array(dstBuf.buffer);

      let {canvas} = javaThis[g2dCanvas];
      let src = javaThis.ctx.getImageData(0,0, canvas.width, canvas.height).data;

      convertToARGB(src, dst);
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
      // TODO there is probably more to check with the colorModel
      if (imageType != 2) {
        thread.throwNewException('Ljava/lang/UnsupportedOperationException;', 'Only know how to drawImage for type TYPE_INT_ARGB.');
        return true;
      }

      let buffer = raster['java/awt/image/Raster/dataBuffer'];
      let srcBuf = (buffer as any as DataBufferInt)['java/awt/image/DataBufferInt/data'].array;
      let src = new Uint8Array(srcBuf.buffer);

      let width = raster['java/awt/image/Raster/width'];
      let height = raster['java/awt/image/Raster/height'];

      let dst = new Uint8ClampedArray(width*height*4);
      convertToRGBA(src, dst);

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
