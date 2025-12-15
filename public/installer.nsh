; Installer script for QuoteInvoice Pro

!macro preInit
  ; Check if .NET Framework 4.7.2 or later is installed
  ReadRegStr $R0 HKLM "Software\Microsoft\NET Framework Setup\NDP\v4\Full" "Version"
  ${If} $R0 == ""
    MessageBox MB_OK "This application requires Microsoft .NET Framework 4.7.2 or later. Please install it first and then run this installer again." "Missing .NET Framework" IDSTOP
    Quit
  ${EndIf}
!macroend

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  
  ; Create desktop shortcut
  CreateShortCut "$DESKTOP\QuoteInvoice Pro.lnk" "$INSTDIR\QuoteInvoice Pro.exe"
  
  ; Create start menu shortcut
  CreateDirectory "$SMPROGRAMS\QuoteInvoice Pro"
  CreateShortCut "$SMPROGRAMS\QuoteInvoice Pro\QuoteInvoice Pro.lnk" "$INSTDIR\QuoteInvoice Pro.exe"
  
SectionEnd

Section "un.quoteinvoicepro" SEC02
  Delete "$DESKTOP\QuoteInvoice Pro.lnk"
  Delete "$SMPROGRAMS\QuoteInvoice Pro\QuoteInvoice Pro.lnk"
  RMDir "$SMPROGRAMS\QuoteInvoice Pro"
  RMDir "$INSTDIR"
SectionEnd