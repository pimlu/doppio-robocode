package javax.swing;

import java.awt.Component;
import java.awt.Canvas;
import java.awt.Point;
import java.awt.Graphics;
// import java.awt.Container;
// import java.awt.Frame;

// import javax.accessibility.Accessible;
// import javax.accessibility.AccessibleContext;
// import javax.swing.JLayeredPane;
// import javax.swing.JRootPane;
// import javax.swing.RootPaneContainer;
// import javax.swing.TransferHandler;
// import javax.swing.WindowConstants;

public class JFrame {
    public JFrame(String title) {}

    Canvas canvas;

    public Component add(Component comp) {
        if (comp instanceof Canvas) {
            if (canvas != null) {
                throw new UnsupportedOperationException("only one canvas supported in a JFrame");
            }
            canvas = (Canvas) comp;

        }

        return comp;
    }

    
    public static final int EXIT_ON_CLOSE = 3;

    public void setDefaultCloseOperation(int op) {}
    public void pack() {}
    public void setLocationRelativeTo(Component comp) {}
    public void setLocation(int x, int y) {}
    public Point getLocation() {
        return new Point();
    }
    public void setResizable(boolean r) {}
    public void setVisible(boolean visible) {
        canvas.setVisible(visible);
        if (!visible) {
            return;
        }
        canvas.repaint();
    }
}

