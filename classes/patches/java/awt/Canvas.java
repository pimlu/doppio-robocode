package java.awt;

public class Canvas extends Component {
    public void requestFocus() {}
    public void setSize(int width, int height) {}

    public void paint(Graphics g) {
       g.clearRect(0, 0, this.width, this.height);
    }
 
    public void update(Graphics g) {
       g.clearRect(0, 0, this.width, this.height);
       this.paint(g);
    }
    
}
