package classes.awt;

import classes.awt.CanvasGraphics2D;
import java.awt.Image;

public class BrowserCanvas {
    CanvasGraphics2D g;

    public BrowserCanvas() {
        init();
    }
    private native void init();
    public native void resize(int width, int height);
    public native void mount();
    public native int width();
    public native int height();

    public CanvasGraphics2D getGraphics() {
        if (g == null) {
            g = new CanvasGraphics2D(this);
        }
        return g;
    }
    public Image getImage() {
        return null;
    }
}
