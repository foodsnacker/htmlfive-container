//
//  ViewController.swift
//  HTMLfive-Container
//
//  (c), (p) 2020-2022 Jörg Burbach, Ducks on the Water
//  Container-App for iOS, can be used for HTMLfive.js
//
//  Dual-Licence: private Or academic (GPL), commercial (proprietary, tbd)
//

import UIKit
import WebKit

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {

    @IBOutlet weak var webView: WKWebView!
    @IBOutlet weak var backView: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.scrollView.alwaysBounceVertical = false
        webView.scrollView.bounces = false
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        
        let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "web")!
        webView.loadFileURL(url, allowingReadAccessTo: url)
        let request = URLRequest(url: url)
        webView.load(request)
    }

//    override var safeAreaInsets: UIEdgeInsets {
//        return UIEdgeInsets.zero
//    }
    
    func viewForZooming(in scrollView: UIScrollView) -> UIView? {
         return nil
    }
}
