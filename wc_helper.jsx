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

// Define the Panel
(function wcHelperPanel (thisObj) {
    /* Build UI */
    function buildUI(thisObj) {

        var windowTitle = "WC Artist Helper";
        var firstButton = "+1";
        var secondButton = "own";
        var thirdButton = "render";
        var fourthButton = "rename";
        var fifthButton = "resize Comp";
        var sixthButton = "Add Letterbox";
                
        var win = (thisObj instanceof Panel)? thisObj : new Window('palette', windowTitle);
        
        var myProjectGroup = win.add ("group");
        win.projectPathLabel = myProjectGroup.add("statictext");
        var myArtistGroup = win.add ("group");
        var artistNameLabel= myArtistGroup.add("statictext");
        win.artistName= myArtistGroup.add("statictext");
        var artistRoleLabel= myArtistGroup.add("statictext");
        win.artistRole= myArtistGroup.add("dropdownlist",undefined,["Offline","Finishing"])
        win.artistRole.selection = 0;
        win.projectPathLabel.text = "000000000000000000000000000000000000000000000000000";
        artistNameLabel.text = "Artist:";
        artistRoleLabel.text = "Role:";       
        win.artistName.text = system.callSystem("whoami");
        var myButtonGroup = win.add ("group");
        myButtonGroup.orientation = "row";
        win.checkbox1 = myButtonGroup.add( "checkbox", undefined, "Dupli:")
        win.checkbox1.value = true;
        win.button1 = myButtonGroup.add ("button", undefined, firstButton);
        win.button2 = myButtonGroup.add ("button", undefined, secondButton);
        var myButtonGroup2 = win.add ("group");
        win.button3 = myButtonGroup2.add ("button", undefined, thirdButton);
        win.button4 = myButtonGroup2.add ("button", undefined, fourthButton);
        var myButtonGroup3 = win.add ("group");
        win.resizeWidth = myButtonGroup3.add ("edittext", undefined, 1920);
        myButtonGroup3.add ("statictext", undefined, "x");
        win.resizeHeight = myButtonGroup3.add ("edittext", undefined, 1080);
        win.button5 = myButtonGroup3.add ("button", undefined, fifthButton);
        myButtonGroup2.alignment = "center";
        myButtonGroup2.alignChildren = "center";
        var myButtonGroup4 = win.add ("group");
        win.button6 = myButtonGroup4.add ("button", undefined, sixthButton);

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
    
        win.button5.onClick = function(){
            var newSize =  [ parseInt(w.resizeWidth.text) , parseInt(w.resizeHeight.text) ] ;
            resizeCompsCanvasCentered( newSize , true )
        }
        
        win.button6.onClick = function(){
             btnAddLetterbox();
        }

        win.onResizing = function(){
            updateProjectPath();
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
    w.projectPathLabel.text = getOutputBasePath();
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
    updateProjectPath()
    var uiPath =  w.projectPathLabel.text;
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
function addLetterbox(){
    var LetterboxLayer = app.project.activeItem.layers.addShape()
    var aspectControl = LetterboxLayer.property("Effects").addProperty("ADBE Slider Control")
    aspectControl.name = "Aspect Ratio"
    aspectControl.property("Slider").setValue(16/9)
    var colorControl = LetterboxLayer.property("Effects").addProperty("ADBE Color Control")
    colorControl.name = "Color"
    colorControl.property("Color").setValue([0,0,0,1])
    LetterboxLayer.name = "Letterbox"
    var compFrame = LetterboxLayer.property("Contents").addProperty("ADBE Vector Shape - Rect")
    compFrame.name = "CompFrame"
    compFrame.property("Size").expression = "[ thisComp.width , thisComp.height ]"
    var letterboxRect = LetterboxLayer.property("Contents").addProperty("ADBE Vector Shape - Rect")
    letterboxRect.name = "Letterbox"
    letterboxRect.property("Size").expression ='w = thisComp.width;\
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
    letterboxFill.color.setValue([0,0,0,1])    
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
    renderSelectedToProjectPath();
}
function btnHerd(){
    compHerder = new CompHerder();
    compHerder.activate();
    //alert("Nothing to test right now.")
}
function btnAddLetterbox(){
    alert("wtf")
    addLetterbox();
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
        if( myPos >= 0 ){
            newText= myText.substr(0,myPos)+"_"+insertText+myText.substr(myPos);
        }else{
            newText= myText.substr(0,myText.length+myPos)+insertText+"_"+myText.substr(myText.length+myPos);
        }
        return newText
    },
    insertAtSelectedItemsNames: function ( text, pos){
        var my_comps = getSelectedProjectItems();

        for ( var i = 0; i < my_comps.length ; i ++ ){
            var myComp = my_comps[i];
            myComp.name = compHerder.methods.insertAt( myComp.name , text , pos);
        }
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
                alignChildren: ['left','center'], \
                orientation: 'row', \
                trimStartEnabled: Checkbox {alignment: ['fill','center']}, \
                trimStart: EditText {text:'TRIM START', enabled : False, alignment: ['fill','center']}, \
                trimEndEnabled: Checkbox {alignment: ['fill','center']}, \
                trimEnd: EditText {text:'TRIM END', enabled : False, alignment: ['fill','center']}, \
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
    myUI.window.tabs.trim_tab.trimGrp.trimBtn.onClick = function(){
        var startTrim = parseInt(myUI.window.tabs.trim_tab.trimGrp.trimStart.text);
        var endTrim = parseInt(myUI.window.tabs.trim_tab.trimGrp.trimEnd.text);
        alert( startTrim +","+ endTrim );

	    // var new_name = myUI.window.tabs.rename_tab.renameGrp.renameString.text;
	    // myUI.methods.rename( myUI.methods.getSelectedProjectItems() , new_name );
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
})(this);

