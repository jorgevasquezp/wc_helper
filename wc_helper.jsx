/*
    Wild Card Helper Panel v.0.1
    
    by Jorge Vásquez Pérez 
    yorchWyorchnet.com
    https://yorchnet.com/
    https://github.com/jorgevasquezp
    
    Changes 0.2:
        - None
    
    TODO:
        - Get artist initials in Windows too.
*/

(function createNullsFromPaths (thisObj) {
    /* Build UI */
    function buildUI(thisObj) {

        var windowTitle = "WC Artist Helper";
        var firstButton = "+1";
        var secondButton = "own";
        var thirdButton = "?";
        var win = (thisObj instanceof Panel)? thisObj : new Window('palette', windowTitle);
            win.spacing = 0;
            win.margins = 4;
            var myButtonGroup = win.add ("group");
                myButtonGroup.spacing = 4;
                myButtonGroup.margins = 0;
                myButtonGroup.orientation = "row";
                win.button1 = myButtonGroup.add ("button", undefined, firstButton);
                win.button2 = myButtonGroup.add ("button", undefined, secondButton);
                win.button3 = myButtonGroup.add ("button", undefined, thirdButton);
                myButtonGroup.alignment = "center";
                myButtonGroup.alignChildren = "center";

            win.button1.onClick = function(){
                versionUpSelectedComps();
            }
            win.button2.onClick = function(){
                button2Click();
            }
            win.button3.onClick = function(){
                button3Click();
            }

        win.layout.layout(true);

        return win
    }


    // Show the Panel
    var w = buildUI(thisObj);
    if (w.toString() == "[object Panel]") {
        w;
    } else {
        w.show();
    }

    /* General functions */
    function pad(n,i){ //pad n with ceroes up to i places.
    if (String(n).length>=i){
        return String(n)
    }else{
        dif = i- (String(n)).length;
        padding = "";
        for (p=0;p<dif;p++){
            padding = padding+"0"
        }
        return padding+String(n)
        }
    }

    function getSelectedProjectItems(){
        var items = [];
        var p = app.project;
        for ( var i = 1 ; i <= p.numItems ; i ++ ){
            var item = p.item(i);
            if ( item.selected ){
                items.push(item);
            }
        }
        return items;
    }
    
    function getRegex( myComp , regex ){
        var offlineRevCode = myComp.name;
        return offlineRevCode.match(regex)[0];
    }

    /* Project Specific functions */

    function getOfflineRevCode( myComp ){
        
        var regex = /[0-9]{2}[a-z]{2}/g; //Maixmum rev number 99
        var offlineRevCode = myComp.name.match(regex)[0];        
        return offlineRevCode;
    }
    function getFinishingRevCode( myComp ){
        
        var regex = /[0-9]{2}[a-z]{2}FIN/g; //Maixmum rev number 99
        var offlineRevCode = myComp.name.match(regex)[0];        
        return offlineRevCode;
    }

    function getArtistInitials(){
        
        //mac only for now ?
        var userName = system.callSystem("whoami");
        
        //coder's exceptionalism
        if ( userName = "jperez" ){
            userName = "jvasquez";
        }

        artistInitials = userName.substring(0,2);

        return artistInitials;
    }
    function versionUpSelectedComps()
    {
        //really selected items, might be worth to restrict to just comps ?
        var selectedComps = getSelectedProjectItems();
        for ( var i = 0 ; i < selectedComps.length ; i ++ )
        {
            versionUpComp( selectedComps[i] );
        }
        

    }
    function versionUpComp( myComp ){

        var offlineRevCode = getOfflineRevCode( myComp );
        splitName = myComp.name.split( offlineRevCode );
        var ver = parseInt(offlineRevCode.substring(1,3));
        //var oldArtistInitials = offlineRevCode.substring(2,5);
        var newArtistInitials = getArtistInitials();

        myComp.name = splitName[0]+pad(ver+1,2)+newArtistInitials+splitName[1] ;
    }

    function button2Click(){
        alert("Button 2 was clicked");
    }
    function button3Click(){
        alert("Button 3 was clicked");
    }


})(this);
