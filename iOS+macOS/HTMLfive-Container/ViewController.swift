//
//  ViewController.swift
//  HTMLfive-Container
//
//  (c), (p) 2020-2022 Jörg Burbach, Ducks on the Water
//  Container-App for iOS, can be used for HTMLfive.js
//
//  Dual-Licence: private Or academic (GPL), commercial (proprietary, tbd)
//

// https://medium.com/john-lewis-software-engineering/ios-wkwebview-communication-using-javascript-and-swift-ee077e0127eb

import UIKit
import WebKit

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {

    @IBOutlet weak var webView: WKWebView!
    @IBOutlet weak var backView: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // delegate everything to self
        webView.uiDelegate = self
        webView.navigationDelegate = self
        
        // no bouncing!
        webView.scrollView.alwaysBounceVertical = false
        webView.scrollView.bounces = false
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        
        // load index.html from folder /web
        let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "web")!
        webView.loadFileURL(url, allowingReadAccessTo: url)
        
        // load the url
        let request = URLRequest(url: url)
        webView.load(request)
    }
    
    func viewForZooming(in scrollView: UIScrollView) -> UIView? {
         return nil
    }
}

// remove safe area to make it fullscreen
class FullScreenWKWebView: WKWebView {
    override var safeAreaInsets: UIEdgeInsets {
        return UIEdgeInsets.zero
    }
}
