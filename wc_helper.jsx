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

(function wcHelperPanel (thisObj) {
    /* Build UI */
    function buildUI(thisObj) {

        var windowTitle = "WC Artist Helper";
        var firstButton = "+1";
        var secondButton = "own";
        var thirdButton = "render";
        var fourthButton = "<< test >>";
        var win = (thisObj instanceof Panel)? thisObj : new Window('palette', windowTitle);
            win.spacing = 0;
            win.margins = 1;
            var myArtistGroup = win.add ("group");
                var artistNameLabel= myArtistGroup.add("statictext");
                win.artistName= myArtistGroup.add("statictext");
                var artistRoleLabel= myArtistGroup.add("statictext");
                win.artistRole= myArtistGroup.add("dropdownlist",undefined,["Offline","Finishing"])
                win.artistRole.selection = 0;
            artistNameLabel.text = "Artist:";
            artistRoleLabel.text = "Role:";
            //****//
            
            win.artistName.text = system.callSystem("whoami");
            var myButtonGroup = win.add ("group");
                myButtonGroup.spacing = 4;
                myButtonGroup.margins = 0;
                myButtonGroup.orientation = "row";
                win.checkbox1 = myButtonGroup.add( "checkbox", undefined, "Dupli:")
                win.checkbox1.value = true;
                win.button1 = myButtonGroup.add ("button", undefined, firstButton);
                win.button2 = myButtonGroup.add ("button", undefined, secondButton);
                win.button3 = myButtonGroup.add ("button", undefined, thirdButton);
                win.button4 = myButtonGroup.add ("button", undefined, fourthButton);
                myButtonGroup.alignment = "center";
                myButtonGroup.alignChildren = "center";

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
                btnTest();
                //alert( getItemByName( getTodayString() ));
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

	    var file = app.project.file;
	    var file_path = String(app.project.file);
	    var output_base = "6_Output";
	    var offline_output_extra = "1_Offline";
	    var finishing_output_extra = "2_Finishing";
	    var ae_string = "0_After_Effects";
        var offline_string = "1_Offline";
	    var finishing_string = "2_Finish";

   	    var search_offline = file_path.search(offline_string);
	    var search_finishing = file_path.search(finishing_string);
        var search_ae = file_path.search(ae_string);
	    
	    var base_path = file_path.substr(0,search_ae)+output_base;
	    

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
				var new_path = getOutputBasePath()+ "/" +extra_path;
			    }
			    else
			    {
				var new_path = getOutputBasePath();
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
    function renderSelectedToProjectPath(){
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
            //todo make sure that the folder doesnt exist yet.
            next_folder = next_folder.items.addFolder(t[i].name);
            
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

    /* UI Buttons */
    function btnPlus1(){
        var dupli = w.checkbox1.value == true; 
        if ( dupli ){
            versiounUpTodaySelectedComps( 1 );
        }else{
            versionUpSelectedComps( 1 );
        }
    }
    function btnOwn(){
        var dupli = w.checkbox1.value == true; 
        if ( dupli ){
            versiounUpTodaySelectedComps( 0 );
        }else{
            versionUpSelectedComps( 0 );
        }
    }

    function btnRender(){
        renderSelectedToProjectPath();
    }

    function btnTest(){
        CompHerder = new CompHerder();
        CompHerder.activate();
        //alert("Nothing to test right now.")
    }

    ////




function CompHerder()
{
    // this.info =
    // {
	// name : "CompHerder",
	// version : 0.1,
	// stage : "development",
	// description : "Tool to manage project items.",
	// url : "yorchnet.com"
    // };
    // this.appearence =
    // {
	// buttonHeight : 30,
	// buttonWidth : 126
    // };
    // this.resources = 
    // {
	// icon : new File('yNet.png'),
    // };
    this.methods =
    {
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
		}\
	    },\
	}";
		
	myUI.window = new Window( res );
	myUI.window.layout.layout(true);

	myUI.window.show();
	
	myUI.window.layout.onResizing = myUI.window.layout.onResize = function () { myUI.layout.resize();}
	
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
	
	return(this);
    }
    this.replaceInSelectedItems = function(){
	var search_string = "GFX";
	var replace_string = "VFX";
    }
    
    this.activate = function activate()
    {
	    w = this.createUI();
    }
    
    this.init();
    return this;
}




    ////

})(this);
