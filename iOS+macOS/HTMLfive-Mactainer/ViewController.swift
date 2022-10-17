//
//  ViewController.swift
//  HTMLfive-Mactainer
//
//  Created by Joerg Burbach on 16.10.22.
//  Copyright © 2022 Joerg Burbach. All rights reserved.
//

import Cocoa
import WebKit

class ViewController: NSViewController, WKUIDelegate {
    var webView: WKWebView!

    // fullscreen view
    override func viewDidAppear() {
        let presOptions: NSApplication.PresentationOptions = [.autoHideDock, .autoHideMenuBar]
        let optionsDictionary = [NSView.FullScreenModeOptionKey.fullScreenModeApplicationPresentationOptions :
            NSNumber(value: presOptions.rawValue)]
      
        self.view.enterFullScreenMode(NSScreen.main!, withOptions:optionsDictionary)
        self.view.wantsLayer = true
    }
    
    // load view
    override func loadView() {
        let webConfiguration = WKWebViewConfiguration ();
        webConfiguration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs");
        webConfiguration.preferences.setValue(true, forKey: "fullScreenEnabled")
        webView = WKWebView (frame: .zero, configuration:webConfiguration);
        webView.uiDelegate = self ;
        view = webView;
    }

    // view did load
    override func viewDidLoad() {
        super.viewDidLoad()

        // load index.html
        if let url = Bundle.main.url ( forResource: "index", withExtension: "html", subdirectory: "web") {
            let path = url.deletingLastPathComponent();
            self.webView.loadFileURL ( url, allowingReadAccessTo: path);
            self.view = webView ;
        }
    }
}
