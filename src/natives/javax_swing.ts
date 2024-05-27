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


  // Export line. This is what DoppioJVM sees.
  return {
    'javax/swing/JFrame': javax_swing_JFrame,
  };
};
