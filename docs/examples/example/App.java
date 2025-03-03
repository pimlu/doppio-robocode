package example;

import java.io.*;
import java.util.Scanner;


import javax.swing.*;

import java.awt.*;
import java.awt.event.*;
import java.awt.image.*;
import java.util.Random;
import java.util.ArrayList;

class MyCanvas extends Canvas {
	final int WIDTH = 500;
	final int HEIGHT = 300;


	private ArrayList<BufferedImage> blocks = new ArrayList<>();
	private Color[] colors = new Color[]{Color.RED, Color.GREEN, Color.BLUE, new Color(0,0,0,0), Color.BLACK, Color.WHITE};
	private int[] types = new int[]{BufferedImage.TYPE_INT_RGB, BufferedImage.TYPE_INT_ARGB, BufferedImage.TYPE_3BYTE_BGR, BufferedImage.TYPE_4BYTE_ABGR};

	private int imgw = 30, imgh = 30;

	private void addImage(int type, Color color) {
		BufferedImage img = new BufferedImage(imgw, imgh, type);
		for (int y = 0; y < imgh; y++) {
			for (int x = 0; x < imgw; x++) {
				img.setRGB(x, y, color.getRGB());
			}
		}
		blocks.add(img);
	}
	private void addBlocks() {
		for (int t = 0; t < types.length; t++) {
			for (int c = 0; c < colors.length; c++) {
				addImage(types[t], colors[c]);
			}
		}
	}
	private void drawBlocks(Graphics2D g) {
		int i = 0;
		for (int t = 0; t < types.length; t++) {
			for (int c = 0; c < colors.length; c++) {
				g.drawImage(blocks.get(i), 10+c*imgw, 10+t*imgh, null);
				i++;
			}
		}
	}

	public MyCanvas() {
		setSize(WIDTH, HEIGHT);
		addBlocks();
	}
	public void paint(Graphics g_) {
		Graphics2D g = (Graphics2D) g_;
		// Thread.dumpStack();
		System.out.println("drawing oval");
		g.drawOval(10, 10, 100, 200);
		System.out.println("done drawing oval");
		drawBlocks(g);
	}
}


class App {
	static MyCanvas game;
  	public static void main(String[] args) {
		System.out.println("DoppioJVM now booted!");
		// Scanner stdin = new Scanner(System.in);
		// System.out.println("What is your name?");
		// if (stdin.hasNextLine())
		// {
		//     String name = stdin.nextLine();
		//     System.out.println("Hello, " + name + "!");
		// }

		//Create and set up the window.
		JFrame frame = new JFrame("Test");
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		//Add contents to the window.
		game = new MyCanvas();
		frame.add(game);

		//Display the window.
		frame.pack();
		frame.setLocationRelativeTo(null);
		frame.setLocation(frame.getLocation().x, frame.getLocation().y - 100);
		frame.setResizable(false);
		frame.setVisible(true);
		game.requestFocus();

		System.out.println("App finished");
	}
}