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
    // FIXME this isn't called anymore
    public static 'createGraphics(Ljava/awt/image/BufferedImage;)Ljava/awt/Graphics2D;'(thread: JVMThread, javaThis: classes_awt_CanvasGraphicsEnvironment, image: JVMTypes.java_awt_image_BufferedImage): JVMTypes.java_awt_Graphics2D {
      let buffer = image['java/awt/image/BufferedImage/raster']['java/awt/image/Raster/dataBuffer'];
      let intbuf = buffer as any;
      console.log("@stu createGraphics", intbuf['java/awt/image/DataBufferInt/data']);
      return null;
    }
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

  class classes_awt_CanvasGraphics2D {
    'classes/awt/CanvasGraphics2D/canvas': classes_awt_BrowserCanvas;
    context: CanvasRenderingContext2D;

    private getCanvas(): classes_awt_BrowserCanvas {
      return this['classes/awt/CanvasGraphics2D/canvas'];
    }

    public static 'init()V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D): void {
      javaThis.context = javaThis.getCanvas().canvas.getContext('2d');
    }

    public static 'writeARGB(Ljava/awt/image/BufferedImage;)V'(thread: JVMThread, javaThis: classes_awt_CanvasGraphics2D, image: JVMTypes.java_awt_image_BufferedImage): void {
      let buffer = image['java/awt/image/BufferedImage/raster']['java/awt/image/Raster/dataBuffer'];
      interface DataBufferInt {
        'java/awt/image/DataBufferInt/data': Uint8Array
      }
      let dst = (buffer as any as DataBufferInt)['java/awt/image/DataBufferInt/data'];
      console.log("@stu createGraphics", dst);

      let {canvas} = javaThis.getCanvas();
      let src = javaThis.context.getImageData(0,0, canvas.width, canvas.height).data;

      for (let i=0; i<src.length; i += 4) {
        dst[i+0] = src[i+3];
        dst[i+1] = src[i+0];
        dst[i+2] = src[i+1];
        dst[i+3] = src[i+2];
      }
    }
  }


  // Export line. This is what DoppioJVM sees.
  return {
    'javax/swing/JFrame': javax_swing_JFrame,
    'classes/awt/CanvasGraphicsEnvironment': classes_awt_CanvasGraphicsEnvironment,
    'classes/awt/BrowserCanvas': classes_awt_BrowserCanvas
  };
};
