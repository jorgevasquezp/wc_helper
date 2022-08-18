/*
    Wild Card Helper Panel v.0.1
    
    by Jorge Vásquez Pérez 
    yorchWyorchnet.com
    https://yorchnet.com/
    https://github.com/jorgevasquezp
    
    Changes 0.3:        - Added a Letterbox tool.
    
    TODO:
        - Get artist initials in Windows too.
*/

// Define the Panel
(function wcHelperPanel (thisObj) {
    /* Build UI */
    function buildUI(thisObj) {

        var windowTitle = "WC Artist Helper";

        var btnTxtIncrement = "+1";
        var btnTxtOwn = "own";
        var btnTxtRender = "render";
        var btnTxtRenamer = "rename";
        var btnTxtResizer = "resize comp";
        var btnTxtCenterRef = "cntr ref";
        var btnTxtLetterbox = "+letterbox";
        var ddlTxtAspects =[ "16:9" , "1:1" , "4:5" , "9:16" , "-" , "1.85:1" , "1.9:1" , "2:1" , "2.2:1" , "21:9" , "2.35:1" , "2.39:1" , "2.4:1" ]
        var ddlTxtShapes =[ "UHD" , "HD", "1x1" , "4x5" , "9x16" , "-" , "CUSTOM" ]
        var ddlTxtCenterRef =[ "V+H" , "V" , "H",  ]
        var btnTxtAlignAnchorPoint = "align ap"
        var btnTxtAlignToLayer = "align 2 lyr"
        var btnTxtFlatten = "flatten"
        var ddlTxtMode = ["Offline","Finishing"]
                
        var win = (thisObj instanceof Panel)? thisObj : new Window('palette', windowTitle);
        
        var myProjectGroup = win.add ("group");
        win.projectPathLabel = myProjectGroup.add("statictext");
        var myArtistGroup = win.add ("group");
        var artistNameLabel= myArtistGroup.add("statictext");
        win.artistName= myArtistGroup.add("statictext");
        var artistRoleLabel= myArtistGroup.add("statictext");
        win.artistRole= myArtistGroup.add( "dropdownlist" , undefined , ddlTxtMode )
        win.artistRole.selection = 0;
        win.projectPathLabel.text = "000000000000000000000000000000000000000000000000000";
        artistNameLabel.text = "Artist:";
        artistRoleLabel.text = "Role:";       
        win.artistName.text = system.callSystem("whoami");
        var myButtonGroup = win.add ("group");
        myButtonGroup.orientation = "row";
        win.checkbox1 = myButtonGroup.add( "checkbox", undefined, "Dupli:")
        win.checkbox1.value = true;
        
        //Increment
        win.button1 = myButtonGroup.add ("button", undefined, btnTxtIncrement);
        win.button1.preferredSize = [45,28]
        
        //Owner
        win.button2 = myButtonGroup.add ("button", undefined, btnTxtOwn);
        win.button2.preferredSize = [45,28]
        
        var myButtonGroup2 = win.add ("group");
        myButtonGroup2.alignment = "center";
        myButtonGroup2.alignChildren = "center";
        
        //Render
        win.button3 = myButtonGroup2.add ("button", undefined, btnTxtRender);
        win.button3.preferredSize = [45,28]

        //Rename
        win.button4 = myButtonGroup2.add ("button", undefined, btnTxtRenamer);
        win.button4a = myButtonGroup2.add ("button", undefined, btnTxtFlatten);
        win.button4.preferredSize = [55,28]
        win.button4a.preferredSize = [45,28]

        //Resizer
        var myButtonGroup3 = win.add ("group");
        var mySizeGroup = myButtonGroup3.add ("group");
        win.resizeWidth = mySizeGroup.add ("edittext", undefined, 1920);
        win.resizeWidth.enabled = false;
        mySizeGroup.add ("statictext", undefined, "x");
        win.resizeHeight = mySizeGroup.add ("edittext", undefined, 1080);
        win.resizeHeight.enabled = false;
        //mySizeGroup.hide();
        var myButtonGroup4 = win.add ("group");
        win.ddlShapes= myButtonGroup4.add( "dropdownlist" , undefined , ddlTxtShapes )
        win.ddlShapes.selection = 1;
        win.button5 = myButtonGroup4.add ("button", undefined, btnTxtResizer);
        
        //Letterbox
        var myButtonGroup4 = win.add ("group");
        win.ddlAspects= myButtonGroup4.add( "dropdownlist" , undefined , ddlTxtAspects )
        win.ddlAspects.selection = 2
        
        win.button6 = myButtonGroup4.add ("button", undefined, btnTxtLetterbox);

        //Center Reference
        var myButtonGroup4a = win.add ("group");
        win.ddlCenterRef= myButtonGroup4a.add( "dropdownlist" , undefined , ddlTxtCenterRef )
        win.ddlCenterRef.selection = 0
        
        win.btnCenterRef = myButtonGroup4a.add ("button", undefined, btnTxtCenterRef);

        //Anchor Alignment tools
        var myButtonGroup5 = win.add ("group");
        win.btnAlgnAP = myButtonGroup5.add ("button", undefined, btnTxtAlignAnchorPoint);
        win.btnAlgn2Lyr = myButtonGroup5.add ("button", undefined, btnTxtAlignToLayer);

        //Render Markers
        var myButtonGroup7 = win.add ("group");
        win.btnRenderMarkers = myButtonGroup7.add ("button", undefined, "render marker");

        win.spacing = 0;
        win.margins = 1;
        myButtonGroup.spacing = 4;
        myButtonGroup.margins = 4;

        win.button1.onClick = function(){
            btnPlus1();
            //versionUpSelectedComps(1);
        }
        win.button2.onClick = function(){
            btnOwn();
        }
        win.button3.onClick = function(){
            btnRender();
        }
        win.button4.onClick = function(){
            btnHerd();
        }
        win.button4a.onClick = function(){
            yFlattenSelectedFolderContents();
        }
        win.button5.onClick = function(){
            var sel = String(win.ddlShapes.selection);
            //alert(sel);
            var newSize =  [ parseInt(w.resizeWidth.text) , parseInt(w.resizeHeight.text) ] ;
            if ( sel == "UHD" ){
                newSize = [3840,2160];
            } else if ( sel == "HD" ){
                newSize = [1920,1080];
            } else if ( sel == "1x1" ){
                newSize = [1080,1080];
            } else if ( sel == "4x5" ){
                newSize = [1080,1350];
            } else if ( sel == "9x16" ){
                newSize = [1080,1920];
            } 
            //alert(newSize)
            resizeCompsCanvasCentered( newSize , true )
        }        
        win.button6.onClick = function(){
            var aspect =  String(win.ddlAspects.selection)
            btnAddLetterbox( aspect );
        }
        win.onResizing = function(){
            updateProjectPath();
        }
        win.ddlShapes.onChange = function(){
            var sel = String(this.selection);
            
            var cust_sel = (sel == "CUSTOM")
            win.resizeHeight.enabled = cust_sel;
            win.resizeWidth.enabled = cust_sel;
            
           
            /*
            if ( sel == "CUSTOM" ){
                mySizeGroup.show();
                win.layout.resize();
            } else {

                mySizeGroup.hide();
                mySizeGroup.layout.resize();
            }
            */            
            $.writeln($.includePath);

        }
        win.btnAlgnAP.onClick = function(){
            AlgnAP();
        }
        win.btnAlgn2Lyr.onClick = function(){
            Algn2Lyr();
        }
        win.btnRenderMarkers.onClick = function(){
            //alert( app.project.renderQueue.items[1].outputModule(1).getSetting("Output File Info") );
            renderMarkers(this.name);
        }
        win.btnCenterRef.onClick = function(){
            var option = String(win.ddlCenterRef.selection)
            btnAddCenterRef( option )
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
w.pad = function ( n, i ){ //pad n with zeroes up to i places.
    if (String(n).length>=i){
        return String(n)
    }else{
        var dif = i- (String(n)).length;
        var padding = "";
        for (p=0;p<dif;p++){
            padding = padding+"0"
        }
        return padding+String(n)
    }
}
function updateProjectPath(){
    var myPath = getOutputBasePath();
    w.projectPathLabel.text = myPath;
    return myPath
    //w.projectPathLabel.text = Math.random() ;
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
function getAllItems( folderItem ){
	
	var items = [];
	var folders = [];
	
	for ( var i = 1 ; i <= folderItem.numItems ; i ++ ){
	var item = folderItem.item(i);
	
	if ( (item.typeName != "Folder") ){
			//if ( (isInArray( items ,item )) == false ){
				items.push( item );
			//}
		}else{
				var new_items = getAllItems(item);
				for ( var j = 0 ; j < new_items.length ; j ++ ){
					new_item = new_items[j];
					//if ( (isInArray ( new_item )) == false ){
						items.push ( new_item );
					//}
				}
			}
		}
	return items
}
function getRegex( myComp , regex ){
    var offlineRevCode = myComp.name;
    return offlineRevCode.match(regex)[0];
}
function getTodayString(){

    dt = new Date();

    var day = w.pad(dt.getDate(),2); //day of month 
    var month = w.pad(dt.getMonth()+1,2); //monnth 1-12
    var year = w.pad(dt.getFullYear().toString().substr(2,4),2); //last 2 digits of year

    todayString = String(month)+"_"+String(day)+"_"+String(year); 
    
    return todayString
}
function getItemTrunk( projectItem ){

    var walkBranch =[]
    currentItem = projectItem;
    
    while ( currentItem.parentFolder.name != "Root"){
        
        walkBranch.push(currentItem.parentFolder );
        currentItem = currentItem.parentFolder;
    }

    return walkBranch
}
function getItemByName( name ){
    
    var items = app.project.items;
    var myItem = null;
    
    for ( var i = 1 ; i <= items.length ; i ++ ){
        
    var currentItem = items[i];
            if ( currentItem.name == name ){
            myItem = currentItem;
        };
    }
    return myItem;
}
function purgeEmptyFolders(){
	//app.beginUndoGroup("Purge Empty Folders")
	var emptyFolders = [];
	
	var p = app.project;
	for ( var i = p.numItems ; i >= 1 ; i -- ){
		item = p.item(i);
		if ( item.typeName == "Folder" ){
			if ( item.numItems <= 0 ){
				item.remove();
			}
		}
	}
	
	//app.endUndoGroup()
}
function flatten( items, root ){
	app.beginUndoGroup("Flatten Selected Folder Contents")
	for ( var i = 0; i < items.length ; i ++){
		item = items[i];
		item.parentFolder = root;
	}
	app.endUndoGroup()
	purgeEmptyFolders();
	return
}
function yFlattenSelectedFolderContents(){
	flatten( getAllItems( getSelectedProjectItems()[0] ) , getSelectedProjectItems()[0] );
}

/* Project Specific functions */
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
function getCompLayersByParented( aComp, isParented ){

    /* TODO 
        not use activeItem. but have the function take a comp as an argument, to avoid activItem becoming obsolete.
    */
    var active_comp = aComp;
    var filtered_layers = [];

    for ( var i = 1; i <= active_comp.layers.length ; i ++ )
    {
        var my_layer = active_comp.layers[i];

        if ( (my_layer.parent == null) != isParented )
        {
            filtered_layers.push( my_layer );
        };
    }
    
    return filtered_layers 
}
function resizeCompCanvas( comp, new_size ){
    comp.width = new_size[0];
    comp.height = new_size[1];
};
function resizeCompCanvasCentered( my_comp, new_size, keep_scaler ){
    /* TO DO AVOID SUCCESEIVE RESCALES TO ADD MORE AND MORE NULLS */

    var n  = my_comp.layers.addNull();
    
    //center null on actual comp size
    n.position.setValue([my_comp.width/2,my_comp.height/2]);
    
    resizeCompCanvas( my_comp , new_size );
    
    
    var unparenterLayers = getCompLayersByParented( my_comp , false );

    //parent unparented layers to MAIN_SCALER
    
    for ( var i = 0; i < unparenterLayers.length ; i ++ ){
        var current_layer = unparenterLayers[i];
        
        if ( (current_layer != n) && ( true )) {
            current_layer.locked = false;
            current_layer.parent = n;
            current_layer.locked = true;
        }
    }

    // center null to new comp size
    n.position.setValue(new_size/2);
   
   //get rid of scaling null or not.
    if (keep_scaler)
    {
        n.name = 'MAIN_SCALER';
    }else{
        n.remove()
    }
    
}
function resizeCompsCanvasCentered( new_size, keep_scaler ){
    app.beginUndoGroup("Resize Comps' Canvas Centered")
    var myComps = getSelectedProjectItems();
    for ( var i = 0 ; i < myComps.length ; i ++){
        var myComp = myComps[i];
        resizeCompCanvasCentered( myComp, new_size, keep_scaler );
    }
    app.endUndoGroup();
}
function setFPS( comp, newFPS ){
    comp.frameDuration = 1/newFPS;
};
function getOfflineRevCode( myComp ){
    
    //var regex = /[0-9]{2}[a-z]{2}/g; //Maixmum rev number 99
    var regex = /[0-9]{2}[a-z]{2}/g; //Maixmum rev number 99
    var offlineRevCode = myComp.name.match(regex)[0];        
    return offlineRevCode;
}
function getFinishingRevCode( myComp ){
    
    var regex = /[0-9]{2}[a-z]{2}[FINCHK]{3}/g; //Maixmum rev number 99
    var offlineRevCode = myComp.name.match(regex)[0];        
    return offlineRevCode;
}
function getItemPath( projectItem ){
    //not too useful right now as AE's paths aren't unique./
    var walkPath =""
    currentItem = projectItem;

    while ( currentItem.parentFolder.name != "Root"){
        walkPath = currentItem.name +"/"+ walkPath;
        currentItem = currentItem.parentFolder;
    }
    walkPath = currentItem.name +"/"+ walkPath;
    walkPath = "/"+ walkPath;
    
    return walkPath
}
function getArtistInitials(){
    
    //mac only for now ?
    var userName = w.artistName.text;
    
    //coder's exceptionalism
    if ( userName = "jperez" ){
        userName = "jvasquez";
    }

    artistInitials = userName.substring(0,2);

    return artistInitials;
}
function versionUpSelectedComps( inc ){
    //really selected items, might be worth to restrict to just comps ?
    var selectedComps = getSelectedProjectItems();
    for ( var i = 0 ; i < selectedComps.length ; i ++ )
    {
        versionUpComp( selectedComps[i], inc );
    }
    

}
function versionUpComp( myComp, inc ){
    role = w.artistRole;

    if ( role.selection.index == 0 ){
        //offline
        var revCode = getOfflineRevCode( myComp );
    }else if ( role.selection.index == 1 ){
        //finishing
        var revCode = getFinishingRevCode( myComp );
    }

    splitName = myComp.name.split( revCode );

    var ver = parseInt(revCode.substring(0,3));
    //alert(ver);
    //var oldArtistInitials = offlineRevCode.substring(2,5);

    var newArtistInitials = getArtistInitials();
    role = w.artistRole;

    if ( role.selection.index == 1 ){
        newArtistInitials = newArtistInitials+"FIN"
    }
    myComp.name = splitName[0]+w.pad(ver+inc,2)+newArtistInitials+splitName[1] ;
}
function getOutputBasePath(){

    var f = app.project.file;
    var f_path = String( f );
    
    var output_base = "6_Output";
    var offline_output_extra = "1_Offline";
    var finishing_output_extra = "2_Finishing";
    var ae_string = "0_After_Effects";
    var offline_string = "1_Offline";
    var finishing_string = "2_Finish";

    var search_offline = f_path.search(offline_string);
    var search_finishing = f_path.search(finishing_string);
    var search_ae = f_path.search(ae_string);
    
    var base_path = f_path.substr(0,search_ae)+output_base;
    
    if( f_path == "null"){
        base_path="~/Desktop";
    }

    if ( search_offline != -1 ){
        //offline
            base_path = base_path+"/"+offline_output_extra;  
    }
    if ( search_finishing != -1 ){
        //finishing
        base_path = base_path+"/"+finishing_output_extra;
    }

    // alert(base_path + "/" + getTodayString());
    return base_path + "/" + getTodayString();
}
function setRenderToProjectPath( rqItem , extra_path ){
    
    var uiPath =  updateProjectPath();
    //alert(uiPath);
    //updateProjectPath();
    //alert(rqItem);
    // alert( rqItem );
    if ( (rqItem.status == 3015) || (rqItem.status == 3013) ){
        for ( var j = 1 ; j <= rqItem.numOutputModules ; j ++ ){
            o_module = rqItem.outputModule(j);    
            var old_name = rqItem.comp.name.replace(".","_");
            //alert(old_name);
            if ( o_module.file != null ){
                if ( extra_path != undefined )
                {
                var new_path = uiPath + "/" +extra_path;
                }
                else
                {
                var new_path = uiPath;
                }
                
                var new_folder = Folder( new_path );
                if ( !new_folder.exists ){
                new_folder.create();
                }
                //alert(new_path + "/" + old_name)
                var new_file = new File( new_path + "/" + old_name );
                o_module.file = new_file ;
                //alert ( new_path );
                //o_module.file= new_file;
                
            }      
            var p = String( o_module.file.path ).split("/");   
            p.splice(0,3);
            var s = "";
            for ( var i = 0 ; i < p.length ; i ++ ){
            s += "\n"+p[i];
            }
            //alert( "Rendering to :" + "\n" + s + "\n\n" + o_module.file.name );
        }
    }
}
function setRendersToProjectPath(){
    updateProjectPath()
    var q = app.project.renderQueue;
    //check the render queue item is not already rendered.
    for ( var i = 1 ; i <= q.numItems ; i ++ ){
    item = q.item(i);
    //3015 is QUEUED 
    //3013 is NEEDS_OUTPUT
    
        if ( (item.status == 3015) || (item.status == 3013) ){
            setRenderToProjectPath( item );
        }
    }
}
function renderSelectedToProjectPath(){;
    updateProjectPath()
    var q = app.project.renderQueue;
    var items = getSelectedProjectItems();
    // alert( items );

    for ( var i = 0 ; i < items.length; i ++){

        if( items[i].typeName == "Composition" ){
            var item = items[i];
            rqItem = q.items.add(item);
            setRenderToProjectPath(rqItem);
        }
        //alert(items);
        if( items[i].typeName == "Folder" ){
            var folder = items[i];
            for ( var j = 1 ; j <= folder.numItems ; j ++ )
            {
                var item = folder.items[j];
                rqItem = q.items.add(item);
                setRenderToProjectPath(rqItem, item.parentFolder.name );
            }
        }
    }
}
function versiounUpTodaySelectedComps( inc ){
    var myComps = getSelectedProjectItems();
    for ( var i = 0 ; i < myComps.length ; i ++ ){
        var myComp = myComps[i];
        versiounUpTodaySelectedComp( myComp,inc );
    }
}
function itemIndexInCollection( itemCollection , itemName ){
    var indexInCollection = -1;
    for ( var i = 1; i <= itemCollection.length ; i ++){
        if ( itemCollection[i].name == itemName ){
            indexInCollection = i;
        }
    }
    return indexInCollection;
}
function versiounUpTodaySelectedComp( myComp, inc ){
    //var my_item = getSelectedProjectItems()[0];

    var t = getItemTrunk(myComp);

    var date_re = "[0-9\_]{8}"

    var next_n // for folder creation
    var new_folder;
    var date_pos
    //create new folder under date folder's parent.
    for ( var i = 0 ; i < t.length ; i ++ )
    {   
        var date_search = t[i].name.search(date_re);
        
        if ( date_search == 0 )
        {
            var date_pos = i;
            var date_string = getTodayString();
            //Check if a dated folder already exists.
            new_folder = getItemByName( date_string );                
            if ( new_folder == null ){
                new_folder = t[i].parentFolder.items.addFolder( date_string )               
            }
        };
    }
    //alert(date_search);
    //create same branch structure as trunk under new date folder.
    var next_folder = new_folder;
    for ( var i = date_pos-1 ; i >= 0 ; i -- )
    {
        var next_folder_name = t[i].name;
        //todo make sure that the folder doesnt exist yet.
        var next_folder_index = itemIndexInCollection( next_folder.items , next_folder_name );
        //alert(next_folder_index);
        if ( next_folder_index == -1 ){
            next_folder = next_folder.items.addFolder(next_folder_name);
        }else{
            next_folder = next_folder.items[next_folder_index];
        }
        
        
    }
    new_comp = myComp.duplicate();
    new_comp.name = myComp.name;
    versionUpComp( new_comp, inc );
    new_comp.parentFolder = next_folder;
    //myComp.selected = false;
    //app.project.activeItem = new_comp;
    myComp.selected = false;
    new_comp.selected = true;
}
function addLetterbox( aspect ){
    app.beginUndoGroup("Add "+aspect+" letterbox");
    var LetterboxLayer = app.project.activeItem.layers.addShape()
    var aspectControl = LetterboxLayer.property("Effects").addProperty("ADBE Slider Control")
    aspectControl.name = "Aspect Ratio"
    var aspectDimensions = aspect.split(":")
    aspectControl.property("Slider").setValue( aspectDimensions[0] / aspectDimensions[1] )
    var colorControl = LetterboxLayer.property("Effects").addProperty("ADBE Color Control")
    colorControl.name = "Color"
    colorControl.property("Color").setValue([0,0,0,1])
    LetterboxLayer.name = String(aspect) + " Letterbox"
    var compFrame = LetterboxLayer.property("Contents").addProperty("ADBE Vector Shape - Rect")
    compFrame.name = "CompFrame"
    compFrame.property("Size").expression = "[ thisComp.width , thisComp.height ]"
    var letterboxRect = LetterboxLayer.property("Contents").addProperty("ADBE Vector Shape - Rect")
    letterboxRect.name = "Letterbox"
    letterboxRect.property("Size").expression = 'w = thisComp.width;\
    h = thisComp.height;\
    compAspect = w / h ;\
    aspect = effect("Aspect Ratio")("Slider");\
    if (compAspect <= aspect ) {\
     	[ w, w / aspect ]\
    }else{\
        [ h*aspect , h ]\
    }'
    var letterboxMerge = LetterboxLayer.property("Contents").addProperty("ADBE Vector Filter - Merge")
    letterboxMerge.mode.setValue(3)
    var letterboxFill = LetterboxLayer.property("Contents").addProperty("ADBE Vector Graphic - Fill")
    letterboxFill.property("Color").expression = 'effect("Color")("Color")'
    app.endUndoGroup()
}
function Algn2Lyr(){
    var exp = '/*    0 center   |   1 right   |   2 left   |   3 top   |   4 bottom   |   5 top right   |   6 top left   |   7 bottom right   |   8 bottom left       */\
    function getAbsScale( myLayer ){\
        s = [1,1];\
        while( myLayer.hasParent == true ){\
            s = [s[0] * (myLayer.transform.scale[0]/100),s[1] * (myLayer.transform.scale[1]/100)];\
    \
            myLayer = myLayer.parent;\
        }\
        if( myLayer .hasParent == false ){\
            s = [s[0] * (myLayer.transform.scale[0]/100),s[1] * (myLayer.transform.scale[1]/100)];\
        }\
        return s*100\
    }\
    function centerTextLayerAnchor( n ){\
        myAnchorLayer = effect("Anchor To Layer")("Layer");\
        r =  myAnchorLayer.sourceRectAtTime();\
        t = r.top; \
        h = r.height; \
        myAnchorLayerAncP = myAnchorLayer.transform.anchorPoint;\
        myAnchorLayerPos = myAnchorLayer.toComp(myAnchorLayerAncP);\
        myAnchorScale = getAbsScale( myAnchorLayer )[0]/100;\
        \
        x = myAnchorLayerPos[0];\
        y = myAnchorLayerPos[1];\
        \
        myMargins = effect("Anchor To Margins")("Point");\
        \
        switch (n){\
        case 0 :\
            offset = [0,0];\
            break;\
        case 1 :\
            offset = [ r.width/2 , 0 , 0];\
            break;\
        case 2 :\
            offset = [ -r.width/2 , 0 , 0];\
            break;\
        case 3 :\
            offset = [0 ,  -r.height/2 , 0];\
            break;\
        case 4 :\
            offset = [0 ,  r.height/2 , 0];\
            break;\
        case 5 :\
            offset = [ r.width/2 ,  -r.height/2 , 0];\
            break;\
        case 6 :\
            offset = [ -r.width/2 ,  -r.height/2 , 0];\
            break;\
        case 7 :\
            offset = [ r.width/2 ,  r.height/2 , 0];\
            break;\
        case 8 :\
            offset = [ -r.width/2 ,  r.height/2 , 0];\
            break;\
        }\
        newAnchor = [ x , y ] + (myAnchorScale*offset) +myMargins ;\
    \
        return newAnchor\
    }\
    \
    anchor_index = effect("Anchor To")("Menu") - 1;\
    centerTextLayerAnchor(anchor_index);'

    var layers = app.project.activeItem.selectedLayers ;
    for ( var i = 0; i < layers.length ; i++ ){
        var fx = layers[i].property("Effects");
        var j = fx.addProperty("ADBE Layer Control").propertyIndex; 
        fx.property(j).name = "Anchor To Layer";
        var j = fx.addProperty("ADBE Dropdown Control").propertyIndex; //Fucking don't call properties by name, it gets messy, use propertyIndex whenever possible.
        fx.property(j).property("Menu").setPropertyParameters( ["center","right","left","top","bottom","top_right","top_left","bottom_right","bottom_left"] );
        fx.property(j).name = "Anchor To";
        j = layers[i].property("Effects").addProperty("ADBE Point Control").propertyIndex;
        fx.property(j).property("Point").setValue([0,0]);
        fx.property(j).name = "Anchor To Margins";
        layers[i].property("Position").expression = exp;
    }
}
function AlgnAP(){
    var exp = '/*    0 center   |   1 right   |   2 left   |   3 top   |   4 bottom   |   5 top right   |   6 top left   |   7 bottom right   |   8 bottom left       */\
function centerTextLayerAnchor( n ){\
	alignToStill = effect("Align to Still")("Checkbox") == true;\
	if (alignToStill){\
		still_time = thisComp.marker.key("Still").time;\
		r =  thisLayer.sourceRectAtTime(still_time);\
	}else{\
		r =  thisLayer.sourceRectAtTime();\
	}\
	t = r.top; \
	h = r.height\
	x = r.left + (r.width/2);\
	y = (t-( t-h)+(t*2))/2;\
	switch (n){\
	case 0 :\
		offset = [0,0];	\
		break;\
	case 1 :\
		offset = [ r.width/2 , 0 , 0];\
		break;\
	case 2 :\
		offset = [ -r.width/2 , 0 , 0];\
		break;\
	case 3 :\
		offset = [0 ,  -r.height/2 , 0];\
		break;\
	case 4 :\
		offset = [0 ,  r.height/2 , 0];\
		break;\
	case 5 :\
		offset = [ r.width/2 ,  -r.height/2 , 0];\
		break;\
	case 6 :\
		offset = [ -r.width/2 ,  -r.height/2 , 0];\
		break;\
	case 7 :\
		offset = [ r.width/2 ,  r.height/2 , 0];\
		break;\
	case 8 :\
		offset = [ -r.width/2 ,  r.height/2 , 0];\
		break;\
	}\
	newAnchor = [ x , y ] + offset;\
	return newAnchor\
}\
anchor_index = effect("Anchor Point Alignment")("Menu") - 1;\
centerTextLayerAnchor(anchor_index);'

    var layers = app.project.activeItem.selectedLayers ;
    for ( var i = 0; i < layers.length ; i++ ){
        var fx = layers[i].property("Effects");
        var j = fx.addProperty("ADBE Dropdown Control").propertyIndex; //Fucking don't call properties by name, it gets messy, use propertyIndex whenever possible.
        fx.property(j).property("Menu").setPropertyParameters( ["center","right","left","top","bottom","top_right","top_left","bottom_right","bottom_left"] );
        fx.property(j).name = "Anchor Point Alignment";
        j = layers[i].property("Effects").addProperty("ADBE Checkbox Control").propertyIndex;
        fx.property(j).name = "Align to Still";
        layers[i].property("Anchor Point").expression = exp;
    }
}
function renderMarkers(  ){
    var rq = app.project.renderQueue;

    var comp = app.project.activeItem;
    var p = comp.markerProperty;
    
    /*
    alert( p.name );
    alert( p.isEffect );
    alert( p.matchName );
    alert( p.numKeys );
    alert( p.propertyDepth );
    alert( p.propertyGroup );
    alert( p.propertyType );
    alert( p.value );
    alert(p[0].name)
    */

    var nKeys = p.numKeys; //Number of markers in the comp.

   for ( var i = 1 ; i <= nKeys ; i ++ )
   {
       
        var mrkr = p.valueAtTime(p.keyTime(i),true); // each markers
        var mrkr_time = p.keyTime(i); // time is not saved in the marker object itself so, to keep track of it save it here.
        
        //add each marker to the queue and set it's path.
        var rqi = rq.items.add(comp); 
        rqi.timeSpanStart= mrkr_time;
        rqi.timeSpanDuration = comp.frameDuration;
        var output_module = rqi.outputModule(1);
        output_module.applyTemplate("05 - JPEG");
        var comp_old_name = comp.name;

        //Change the name template to the one STILLS or NOT_SEQUENCES have.
        var seq_temp = 'Template":"[compName]_[#####].[fileextension]';
        var new_temp = 'Template":"[compName]_'+ mrkr.comment+'.[fileextension]';        

        /*var s1 = output_module.getSettings();
        for (i in s1){
            alert(i);
        }
        */

        //alert( output_module.getSetting("Format") );
        //alert( output_module.getSetting("Use Comp Frame Number") );

        var set = output_module.getSetting("Output File Info"); // <--- This is the Settings Object where the file template lives.
        output_module.setSetting("Output File Info", set.replace( seq_temp , new_temp ) );
        
        //set = output_module.getSetting("Output File Info");
   }
}
function AddCenterRef ( option ){
    activeComp = app.project.activeItem
    var CenterRefLayer = activeComp.layers.addShape()
    CenterRefLayer.guideLayer = true;
    CenterRefLayer.name = String( option ) + " Center Ref"

    var heightControl = CenterRefLayer.property("Effects").addProperty("ADBE Slider Control")
    heightControl.name = "Height"
    var heightRef = CenterRefLayer.property("Contents").addProperty("ADBE Vector Shape - Rect")
    //heightRef.property("Slider").setValue(activeComp.height/3);
    heightRef.name = "Height Ref"
    heightRef.property("Size").expression = 'w = thisComp.width;\
    h = thisComp.height;\
    [w,thisComp.layer("'+ CenterRefLayer.name +'").effect("Height")("Slider")]'

    var widthControl = CenterRefLayer.property("Effects").addProperty("ADBE Slider Control")
    widthControl.name = "Width"
    var widthRef = CenterRefLayer.property("Contents").addProperty("ADBE Vector Shape - Rect")
    //widthRef.property("Slider").setValue(activeComp.width/3);
    widthRef.name = "Width Ref"
    widthRef.property("Size").expression = 'w = thisComp.width;\
    h = thisComp.height;\
    [thisComp.layer("'+ CenterRefLayer.name +'").effect("Width")("Slider"),h]'

    var CenterRefStroke = CenterRefLayer.property("Contents").addProperty("ADBE Vector Graphic - Stroke")
    
    //alert ( option );
}

/* UI Buttons */
function btnPlus1(){
    var dupli = w.checkbox1.value == true; 
    if ( dupli ){
        app.beginUndoGroup("Create copies of selected Comps for today and increment.")
        versiounUpTodaySelectedComps( 1 );
    }else{
        app.beginUndoGroup("Increment selected Comps.")
        versionUpSelectedComps( 1 );
    }
    app.endUndoGroup()
}
function btnOwn(){
    var dupli = w.checkbox1.value == true; 
    if ( dupli ){
        app.beginUndoGroup("Own duplicates of selected Comps.")
        versiounUpTodaySelectedComps( 0 );
    }else{
        app.beginUndoGroup("Own selected Comps.")
        versionUpSelectedComps( 0 );
    }
}
function btnRender(){
    updateProjectPath();
    renderSelectedToProjectPath();
}
function btnHerd(){
    compHerder = new CompHerder();
    compHerder.activate();
    //alert("Nothing to test right now.")
}
function btnAddLetterbox( aspect ){
    addLetterbox( aspect );
    /*
    app.beginUndoGroup("Add Letterbox")
    addLetterbox(  );
    app.endUndoGroup()
    */
}
function CompHerder(){
    this.methods ={
	pad : function ( n , pad ) {
		zeros = "";
		for ( i = 0 ; i < pad ; i ++ )
		{
		    zeros+="0";
		}
		n = String(n);
		padded = zeros.substr( 0, pad - n.length ) + String(n) ;
		return padded
	},
	replace: function( items , string , newString ){
	    for ( i = 0 ; i < items.length ; i ++ ){
		var item = items[i];
		item.name = item.name.replace( string , newString );
	    }
	    return true;
	},
	getSelectedProjectItems: function  (){
	    var items = [];
	    var p = app.project;
	    for ( var i = 1 ; i <= p.numItems ; i ++ ){
		var item = p.item(i);
		if ( item.selected ){
		    items.push(item);
		}
	    }
	    //items = items.concat( app.project.activeItem.selectedItems );
	    return items;
	},
	suffix: function ( items , suffix ){
	    for ( i = 0 ; i < items.length ; i ++ ){
		    var item = items[i];
		    if ( item.name.search( suffix ) != (item.name.length - suffix.length) ){
			item.name+= "_"+suffix;
		    }
		    
		}
		return true;
	},
	prefix : function( items , prefix ){
		for ( i = 0 ; i < items.length ; i ++ )
		{
		    var item = items[i];
		    if ( item.name.search( prefix ) != 0 ){
			item.name = prefix + "_" + item.name;
		    }
		}
		return true;
	},
	rename: function ( items , new_name ){
	    for ( i = 0 ; i < items.length ; i ++ ){
		var item = items[i];
		item.name = new_name + "_" + i;
	    }
	
	},
    insert: function ( position , insert_text  ){
        compHerder.methods.insertAtSelectedItemsNames(insert_text, position );
	},
    insertAt: function ( text , insertText, pos ){
        var myText = text;
        var insertText = insertText;
        var myPos = pos;
        var newText;
        if( myPos > 0 ){
            newText= myText.substr(0,myPos)+"_"+insertText+"_"+myText.substr(myPos);
        }else if (myPos == 0){
            newText= insertText+"_"+myText;
        }
        else
        {
            if (myPos == -1){
                newText= myText+"_"+insertText;
            }else{
                newText= myText.substr(0,myText.length+myPos+1)+"_"+insertText+"_"+myText.substr(myText.length+myPos+1);
            }
        }
        return newText
    },
    insertAtSelectedItemsNames: function ( text, pos){
        app.beginUndoGroup("Insert at Selected Items' names");
        var my_comps = getSelectedProjectItems();

        for ( var i = 0; i < my_comps.length ; i ++ ){
            var myComp = my_comps[i];
            myComp.name = compHerder.methods.insertAt( myComp.name , text , pos);
        }
        app.endUndoGroup();
    }

	
    }
    this.init = function init()
    {
	// this.btnLauyout = 
	// "button\
	//  {\
	//     preferredSize: ['" + this.appearence.buttonWidth + "','" + this.appearence.buttonHeight + "'],\
	//     text:'" + this.info.name + "',\
	//     helpTip:'" + this.info.description + "'\
	//  }";
	
	// this. res = 
	//  "window\
	// {\
	//     type:'palette',\
	//     text:'" + this.info.name + ' ' + this.info.ver + ' ' + this.info.stage + "',\
	//     info: Group \
	//     {\
	// 	alignment:['center','bottom'],\
	// 	icon: Image \
	// 	{\
	// 	    icon:'" + this.resources.icon.path + '/' + this.resources.icon.name + "',\
	// 	    preferredSize: [15, 18]\
	// 	},\
	// 	website: StaticText\
	// 	{\
	// 	    text:'" + this.info.url + "',\
	// 	    alignment:['fill','center']\
	// 	},\
	//     }\
	// }";
    }
    this.createUI = function createUI( )
    {
	var myUI = this;
	var res = 
	"window { \
	    text: 'CompHerder',\
	    alignment: ['fill','fill'], \
	    alignChildren: ['center','top'], \
	    orientation: 'column', \
	    resizeable: 'true',\
	    tabs: Panel {\
		type: 'tabbedpanel',\
		alignment: ['fill','fill'], \
		alignChildren: ['center','top'], \
		search_tab: Panel {\
		    type: 'tab',\
		    text: 'Search & Replace',\
		    orientation: 'column', \
		    alignChildren: ['center','top'], \
		    searchGrp: Group {\
			alignment: ['fill','fill'], \
			alignChildren: ['center','top'], \
			orientation: 'column', \
			searchString: EditText {text:'SEARCH FOR TEXT',alignment: ['fill','center']}, \
		    },\
		    replaceGrp: Group {\
			alignment: ['fill','fill'], \
			alignChildren: ['center','center'], \
			orientation: 'column', \
			replaceString: EditText {text:'REPLACE WITH TEXT',alignment: ['fill','center']}, \
		    }\
		    doItBtn: Button {text: 'Replace in selected Comps', alignment: ['center','center']} , \
		}\
		suprefix: Panel {\
		    type: 'tab',\
		    text: 'Suffix / Prefix',\
		    orientation: 'column', \
		    suprefixGrp: Group {\
			alignment: ['fill','fill'], \
			alignChildren: ['left','center'], \
			orientation: 'column', \
			pre:Group {\
			    alignment: ['fill','fill'], \
			    alignChildren: ['left','center'], \
			    orientation: 'row', \
			    prefixString: EditText {text:'PREFIX',alignment: ['fill','center']}, \
			    prefixBtn: Button {text: 'Preffix'} , \
			},\
			su:Group{\
			    alignment: ['fill','fill'], \
			    alignChildren: ['left','center'], \
			    orientation: 'row', \
			    sufixString: EditText {text:'SUFIX',alignment: ['fill','center']}, \
			    sufixBtn: Button {text: 'Sufix'} , \
			}\
		    },\
		},\
		rename_tab: Panel {\
		    type: 'tab',\
		    text: 'Rename',\
		    renameGrp: Group {\
                alignment: ['fill','fill'], \
                alignChildren: ['left','center'], \
                orientation: 'row', \
                renameString: EditText {text:'NEW NAME',alignment: ['fill','center']}, \
                renameBtn: Button {text: 'Rename'} ,\
		        }\
		    },\
        insert_tab: Panel {\
            type: 'tab',\
		    text: 'Insert',\
            insertGrp: Group {\
                alignment: ['fill','fill'], \
                alignChildren: ['left','center'], \
                orientation: 'row', \
                insertStart: EditText {text:'INSERT AT',alignment: ['fill','center']}, \
                insertText: EditText {text:'INSERT TEXT',alignment: ['fill','center']}, \
                insertBtn: Button {text: 'Insert'} ,\
		        }\
		    },\
        trim_tab: Panel {\
            type: 'tab',\
		    text: 'Trim',\
            trimGrp: Group {\
                alignment: ['fill','fill'], \
                alignChildren: ['center','center'], \
                orientation: 'row', \
                trimStartEnabled: Checkbox {text:'TRIM START:'}, \
                trimStart: EditText {text:'0', enabled : False}, \
                trimEndEnabled: Checkbox {text:'TRIM END:'}, \
                trimEnd: EditText {text:'0', enabled : False}, \
                trimBtn: Button {text: 'Trim'} ,\
		        }\
		    },\
        },\
	},\
    }";
		
	myUI.window = new Window( res );
	myUI.window.layout.layout(true);

	myUI.window.show();
	
	myUI.window.layout.onResizing = myUI.window.layout.onResize = function () { myUI.layout.resize();}
	
    //CLEAR FIELDS
    myUI.window.tabs.search_tab.searchGrp.searchString.onActivate = function(){
        myUI.window.tabs.search_tab.searchGrp.searchString.text = "";        
    }
     myUI.window.tabs.search_tab.replaceGrp.replaceString.onActivate = function(){
        myUI.window.tabs.search_tab.replaceGrp.replaceString.text = "";        
    }
	
    //EVENT HANDLERS
	myUI.window.tabs.search_tab.doItBtn.onClick = function(){
	    var search_str = myUI.window.tabs.search_tab.searchGrp.searchString.text;
	    var replace_str = myUI.window.tabs.search_tab.replaceGrp.replaceString.text;
	    myUI.methods.replace( myUI.methods.getSelectedProjectItems() , search_str , replace_str );
	};
	myUI.window.tabs.suprefix.suprefixGrp.pre.prefixBtn.onClick = function(){
	    var pre = myUI.window.tabs.suprefix.suprefixGrp.pre.prefixString.text;
	    myUI.methods.prefix( myUI.methods.getSelectedProjectItems() , pre );
	};
	myUI.window.tabs.suprefix.suprefixGrp.su.sufixBtn.onClick = function(){
	    var su = myUI.window.tabs.suprefix.suprefixGrp.su.sufixString.text;
	    myUI.methods.suffix( myUI.methods.getSelectedProjectItems() , su );
	};
	myUI.window.tabs.rename_tab.renameGrp.renameBtn.onClick = function(){
	    var new_name = myUI.window.tabs.rename_tab.renameGrp.renameString.text;
	    myUI.methods.rename( myUI.methods.getSelectedProjectItems() , new_name );
	};
    myUI.window.tabs.insert_tab.insertGrp.insertBtn.onClick = function(){
        
	    var insert_at = parseInt(myUI.window.tabs.insert_tab.insertGrp.insertStart.text);
        var insert_text = myUI.window.tabs.insert_tab.insertGrp.insertText.text;
        
        myUI.methods.insert( insert_at , insert_text );

	    // myUI.methods.rename( myUI.methods.getSelectedProjectItems() , new_name );
	};
    myUI.window.tabs.trim_tab.trimGrp.trimStartEnabled.onClick = function(){
        
        if ( myUI.window.tabs.trim_tab.trimGrp.trimStartEnabled.value == false){
            myUI.window.tabs.trim_tab.trimGrp.trimStart.text = 'TRIM START';
        }else{
            myUI.window.tabs.trim_tab.trimGrp.trimStart.text = 0;
        }

        myUI.window.tabs.trim_tab.trimGrp.trimStart.enabled =  myUI.window.tabs.trim_tab.trimGrp.trimStartEnabled.value;
        
    };
    myUI.window.tabs.trim_tab.trimGrp.trimEndEnabled.onClick = function(){
        
        if ( myUI.window.tabs.trim_tab.trimGrp.trimEndEnabled.value == false){
            myUI.window.tabs.trim_tab.trimGrp.trimEnd.text = 'TRIM END';
        }else{
            myUI.window.tabs.trim_tab.trimGrp.trimEnd.text = 0;
        }

        myUI.window.tabs.trim_tab.trimGrp.trimEnd.enabled = myUI.window.tabs.trim_tab.trimGrp.trimEndEnabled.value;

        
    };
    myUI.window.tabs.trim_tab.trimGrp.trimBtn.onClick = function(){
        app.beginUndoGroup("Trim Comp Names");
        var startTrim = parseInt(myUI.window.tabs.trim_tab.trimGrp.trimStart.text);
        var endTrim = parseInt(myUI.window.tabs.trim_tab.trimGrp.trimEnd.text);       
        
	    var myComps = getSelectedProjectItems();
        for ( var i = 0 ; i < myComps.length ; i ++ ){            
            var myComp = myComps[i];
            myComp.name = myComp.name.substr(0 + startTrim ,myComp.name.length - endTrim);
        }
        app.endUndoGroup();
	};
	
	return(this);
    }
    
    this.activate = function activate()
    {
	    w = this.createUI();
    }
    
    this.init();
    return this;
}
function btnFlatten(){
    yFlattenSelectedFolderContents();
}
function btnAddCenterRef( option ){
    AddCenterRef( option )
}

})(this);