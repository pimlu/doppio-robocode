package classes.awt;

import java.awt.*;
import java.awt.RenderingHints.Key;
import java.awt.font.FontRenderContext;
import java.awt.font.GlyphVector;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.awt.image.BufferedImageOp;
import java.awt.image.ImageObserver;
import java.awt.image.RenderedImage;
import java.awt.Image;
import java.awt.image.renderable.RenderableImage;
import java.text.AttributedCharacterIterator;
import java.util.Map;

import classes.awt.BrowserCanvas;

public class CanvasGraphics2D extends Graphics2D {

    private BrowserCanvas canvas;

    public Runnable postDrawSync;

    public CanvasGraphics2D(BrowserCanvas canvas) {
        this.canvas = canvas;
        init();
    }
    private native void init();

    private void sync() {
        if (postDrawSync != null) {
            postDrawSync.run();
        }
    }

    public Image getImage() {
        int width = this.canvas.width(), height = this.canvas.height();
        BufferedImage img = new BufferedImage(BufferedImage.TYPE_INT_ARGB, width, height);
        writeARGB(img);
        return img;
    }

    private native void writeARGB(BufferedImage img);

    @Override
    public void addRenderingHints(Map<?, ?> hints) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'addRenderingHints'");
    }

    @Override
    public void clip(Shape s) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'clip'");
    }

    @Override
    public void draw(Shape s) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'draw'");
    }

    @Override
    public void drawGlyphVector(GlyphVector g, float x, float y) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawGlyphVector'");
    }

    @Override
    public boolean drawImage(Image img, AffineTransform xform, ImageObserver obs) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawImage'");
    }

    @Override
    public void drawImage(BufferedImage img, BufferedImageOp op, int x, int y) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawImage'");
    }

    @Override
    public void drawRenderableImage(RenderableImage img, AffineTransform xform) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawRenderableImage'");
    }

    @Override
    public void drawRenderedImage(RenderedImage img, AffineTransform xform) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawRenderedImage'");
    }

    @Override
    public void drawString(String str, int x, int y) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawString'");
    }

    @Override
    public void drawString(String str, float x, float y) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawString'");
    }

    @Override
    public void drawString(AttributedCharacterIterator iterator, int x, int y) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawString'");
    }

    @Override
    public void drawString(AttributedCharacterIterator iterator, float x, float y) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawString'");
    }

    @Override
    public void fill(Shape s) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'fill'");
    }

    @Override
    public Color getBackground() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getBackground'");
    }

    @Override
    public Composite getComposite() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getComposite'");
    }

    @Override
    public GraphicsConfiguration getDeviceConfiguration() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getDeviceConfiguration'");
    }

    @Override
    public FontRenderContext getFontRenderContext() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getFontRenderContext'");
    }

    @Override
    public Paint getPaint() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getPaint'");
    }

    @Override
    public Object getRenderingHint(Key hintKey) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getRenderingHint'");
    }

    @Override
    public RenderingHints getRenderingHints() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getRenderingHints'");
    }

    @Override
    public Stroke getStroke() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getStroke'");
    }

    @Override
    public AffineTransform getTransform() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getTransform'");
    }

    @Override
    public boolean hit(Rectangle rect, Shape s, boolean onStroke) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'hit'");
    }

    @Override
    public void rotate(double theta) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'rotate'");
    }

    @Override
    public void rotate(double theta, double x, double y) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'rotate'");
    }

    @Override
    public void scale(double sx, double sy) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'scale'");
    }

    @Override
    public void setBackground(Color color) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setBackground'");
    }

    @Override
    public void setComposite(Composite comp) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setComposite'");
    }

    @Override
    public void setPaint(Paint paint) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setPaint'");
    }

    @Override
    public void setRenderingHint(Key hintKey, Object hintValue) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setRenderingHint'");
    }

    @Override
    public void setRenderingHints(Map<?, ?> hints) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setRenderingHints'");
    }

    @Override
    public void setStroke(Stroke s) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setStroke'");
    }

    @Override
    public void setTransform(AffineTransform Tx) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setTransform'");
    }

    @Override
    public void shear(double shx, double shy) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'shear'");
    }

    @Override
    public void transform(AffineTransform Tx) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'transform'");
    }

    @Override
    public void translate(int x, int y) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'translate'");
    }

    @Override
    public void translate(double tx, double ty) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'translate'");
    }

    @Override
    public void clearRect(int x, int y, int width, int height) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'clearRect'");
    }

    @Override
    public void clipRect(int x, int y, int width, int height) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'clipRect'");
    }

    @Override
    public void copyArea(int x, int y, int width, int height, int dx, int dy) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'copyArea'");
    }

    @Override
    public Graphics create() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'create'");
    }

    @Override
    public void dispose() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'dispose'");
    }

    @Override
    public void drawArc(int x, int y, int width, int height, int startAngle, int arcAngle) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawArc'");
    }

    @Override
    public boolean drawImage(Image img, int x, int y, ImageObserver observer) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawImage'");
    }

    @Override
    public boolean drawImage(Image img, int x, int y, Color bgcolor, ImageObserver observer) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawImage'");
    }

    @Override
    public boolean drawImage(Image img, int x, int y, int width, int height, ImageObserver observer) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawImage'");
    }

    @Override
    public boolean drawImage(Image img, int x, int y, int width, int height, Color bgcolor, ImageObserver observer) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawImage'");
    }

    @Override
    public boolean drawImage(Image img, int dx1, int dy1, int dx2, int dy2, int sx1, int sy1, int sx2, int sy2,
            ImageObserver observer) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawImage'");
    }

    @Override
    public boolean drawImage(Image img, int dx1, int dy1, int dx2, int dy2, int sx1, int sy1, int sx2, int sy2,
            Color bgcolor, ImageObserver observer) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawImage'");
    }

    @Override
    public void drawLine(int x1, int y1, int x2, int y2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawLine'");
    }

    @Override
    public void drawOval(int x, int y, int width, int height) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawOval'");
    }

    @Override
    public void drawPolygon(int[] xPoints, int[] yPoints, int nPoints) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawPolygon'");
    }

    @Override
    public void drawPolyline(int[] xPoints, int[] yPoints, int nPoints) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawPolyline'");
    }

    @Override
    public void drawRoundRect(int x, int y, int width, int height, int arcWidth, int arcHeight) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'drawRoundRect'");
    }

    @Override
    public void fillArc(int x, int y, int width, int height, int startAngle, int arcAngle) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'fillArc'");
    }

    @Override
    public void fillOval(int x, int y, int width, int height) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'fillOval'");
    }

    @Override
    public void fillPolygon(int[] xPoints, int[] yPoints, int nPoints) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'fillPolygon'");
    }

    @Override
    public void fillRect(int x, int y, int width, int height) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'fillRect'");
    }

    @Override
    public void fillRoundRect(int x, int y, int width, int height, int arcWidth, int arcHeight) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'fillRoundRect'");
    }

    @Override
    public Shape getClip() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getClip'");
    }

    @Override
    public Rectangle getClipBounds() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getClipBounds'");
    }

    @Override
    public Color getColor() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getColor'");
    }

    @Override
    public Font getFont() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getFont'");
    }

    @Override
    public FontMetrics getFontMetrics(Font f) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getFontMetrics'");
    }

    @Override
    public void setClip(Shape clip) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setClip'");
    }

    @Override
    public void setClip(int x, int y, int width, int height) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setClip'");
    }

    @Override
    public void setColor(Color c) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setColor'");
    }

    @Override
    public void setFont(Font font) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setFont'");
    }

    @Override
    public void setPaintMode() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setPaintMode'");
    }

    @Override
    public void setXORMode(Color c1) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setXORMode'");
    }
    
}