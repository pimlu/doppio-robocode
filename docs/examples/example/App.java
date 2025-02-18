package example;

import java.io.*;
import java.util.Scanner;


import javax.swing.*;

import java.awt.*;
import java.awt.event.*;
import java.awt.image.*;
import java.util.Random;

class MyCanvas extends Canvas {
	final int WIDTH = 500;
	final int HEIGHT = 300;

  public MyCanvas() {
		setSize(WIDTH, HEIGHT);
        
  }
	public void paint(Graphics g_) {
		Graphics2D g = (Graphics2D) g_;
		Thread.dumpStack();
		g.drawOval(10, 10, 100, 200);
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

  }
}