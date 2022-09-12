; www2mac.pb 0.0.1
; (c), (p) 2020-2022 Jörg Burbach, Ducks on the Water 
; Container-App for MacOS, can be used for HTMLfive.js
; 
;	Dual-Licence: private Or academic (GPL), commercial (proprietary, tbd)

EnableExplicit

Global titel.s = "HTMLfive-container"
Global Language.s
Global ExitApp.b
Global wide
Global height
Global event, menuEvent

; Shortcuts
Enumeration 
  #showmenu
  #quitapp
EndEnumeration

; for intercepting the ESC-Key and event-handling
ImportC ""
  sel_registerName(STR.p-ascii)
  class_addMethod(class, selector, imp, types.p-ascii)
  objc_allocateClassPair(class, newClassName.p-ascii, extraBytes)
  objc_registerClassPair(class)
  object_setClass(object, class)
EndImport

Procedure SubClassGadget(Gadget, newClassName.s)
  Protected oldclass = CocoaMessage(0, GadgetID(Gadget), "class")
  Protected result = 0
  result = objc_allocateClassPair(oldclass, newClassName, 0)
  objc_registerClassPair(result)
  object_setClass(GadgetID(Gadget), result)
  ProcedureReturn result
EndProcedure

Procedure SubClassWindow(Window, newClassName.s)
  Protected oldclass = CocoaMessage(0, WindowID(Window), "class")
  Protected result = 0
  result = objc_allocateClassPair(oldclass, newClassName, 0)
  objc_registerClassPair(result)
  object_setClass(WindowID(Window), result)
  ProcedureReturn result
EndProcedure

Procedure CocoaAddMethod(Class, Method.s, CallBack)
  Protected sel = sel_registerName(Method)
  class_addMethod(Class, sel, CallBack, "v@:@")
EndProcedure

ProcedureC EventHandler(sender)
  ExitApp = #True
EndProcedure

; Languages - e.g. de_DE
Procedure.s GetUserLocale()
  Protected result.s, NSUserDefaults_defs, NSString_locale
  
  NSUserDefaults_defs = CocoaMessage(0,0,"NSUserDefaults standardUserDefaults")
  If NSUserDefaults_defs
    NSString_locale  = CocoaMessage(0,NSUserDefaults_defs,"objectForKey:$",@"AppleLocale")
    If NSString_locale
      result = PeekS(CocoaMessage(0, NSString_locale, "UTF8String"), -1, #PB_UTF8)
    EndIf
  EndIf
  ProcedureReturn result
EndProcedure

; load a file
Procedure.s LoadHTML()
  
  ; if this is run inside PureBasic, open the index.html from inside the .app-package
  CompilerIf #PB_Compiler_Debugger = 0
    Define full.s = ProgramFilename()
    Define pos = FindString(full,".app")
    full = Left(full, pos + 4)
    Define url.s = URLEncoder(full + "/Contents/web/index.html")
  CompilerElse
    Define url.s = URLEncoder("/Users/joerg/Documents/GitHub/htmlfive.net/test.html")
  CompilerEndIf
  
  ProcedureReturn url
EndProcedure

Procedure InitApp()
  ; App-Delegate
  Global appDelegate = CocoaMessage(0, CocoaMessage(0, 0, "NSApplication sharedApplication"), "delegate")
  Global delegateClass = CocoaMessage(0, appDelegate, "class")
  
  ; Create App
  Language = GetUserLocale()
  
  ; Desktop-Größe
  ExamineDesktops()
  wide = DesktopWidth(0)
  height = DesktopHeight(0)
EndProcedure

Procedure CreateHTMLWindow(url.s)
  OpenWindow(0,0,0,wide,height,titel)       ; open a fullscreen-window
  WebGadget(0,0,0,wide,height,url)          ; adding a webgadget using MacOS-Safari
    
  ; go Fullscreen!
  CocoaMessage(0, WindowID(0), "setCollectionBehavior:", 128)
  CocoaMessage(0, WindowID(0), "toggleFullScreen:")
  
  ; set Everything as Standards for Webgadget
  Define temp = CocoaMessage(0, 0, "NSUserDefaults standardUserDefaults")
  CocoaMessage(0, temp, "setBool:", #YES, "forKey:$", @"WebKitJavaScriptEnabled")
  CocoaMessage(0, temp, "setBool:", #YES, "forKey:$", @"WebKitFullScreenEnabled")
  CocoaMessage(0, temp, "setBool:", #YES, "forKey:$", @"WebKitWebAudioEnabled")
  
  ; add some more magic
  temp = CocoaMessage(0, GadgetID(0), "preferences")
  CocoaMessage(0, temp, "setJavaScriptEnabled:", #YES)
  CocoaMessage(0, temp, "setFullScreenEnabled:", #YES)
  
  ; now intercept the ESC-Button - normally, this would quit fullscreen!
  temp = SubClassWindow(0, "MyStringGadget")
  CocoaAddMethod(temp, "cancelOperation:", @EventHandler())
  
  ; Keyboard input
  AddKeyboardShortcut(0, #PB_Shortcut_Escape, #showmenu)                ; ESC-KEy
  AddKeyboardShortcut(0, #PB_Shortcut_Command|#PB_Shortcut_Q,#quitapp)  ; CMD-Q = Quit
EndProcedure

InitApp()
Define url.s = LoadHTML()
CreateHTMLWindow(url)

Repeat
  event = WaitWindowEvent(25)  
  
  ; some keys?
  If event = #PB_Event_Menu
    menuEvent = EventMenu()
    Select menuEvent
      Case #showmenu: ; what happens after pressing the ESC-key?
        Debug "You pressed ESC"
      Case #quitapp: ExitApp = #True
    EndSelect
  EndIf
    
  If ExitApp = #True
    End
  EndIf
ForEver
  
; IDE Options = PureBasic 6.00 LTS (MacOS X - x64)
; CursorPosition = 150
; FirstLine = 39
; Folding = g6
; EnableXP
; Executable = binary/container.app