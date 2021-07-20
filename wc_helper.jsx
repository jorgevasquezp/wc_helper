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
            win.margins = 4;
            var myArtistGroup = win.add ("group");
                artistNameLabel= myArtistGroup.add("statictext");
                artistName= myArtistGroup.add("statictext");
                artistRoleLabel= myArtistGroup.add("statictext");
                artistRole= myArtistGroup.add("dropdownlist",undefined,["Offline","Finishing"])
                artistRole.selection = 0;
            artistNameLabel.text = "Artist:";
            artistRoleLabel.text = "Role:";
            artistName.text = system.callSystem("whoami");
            var myButtonGroup = win.add ("group");
                myButtonGroup.spacing = 4;
                myButtonGroup.margins = 0;
                myButtonGroup.orientation = "row";
                win.button1 = myButtonGroup.add ("button", undefined, firstButton);
                win.button2 = myButtonGroup.add ("button", undefined, secondButton);
                win.button3 = myButtonGroup.add ("button", undefined, thirdButton);
                win.button4 = myButtonGroup.add ("button", undefined, fourthButton);
                myButtonGroup.alignment = "center";
                myButtonGroup.alignChildren = "center";

            win.button1.onClick = function(){
                versionUpSelectedComps(1);
            }
            win.button2.onClick = function(){
                versionUpSelectedComps(0);
            }
            win.button3.onClick = function(){
                renderSelectedToProjectPath();
            }

             win.button4.onClick = function(){
                test();
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

    // function renderSelectedComps(){
    //     // alert();
    // }


    function getTodayString(){
        dt = new Date();
        y =  String(dt.getFullYear()).substring(2,4);
        m = pad(dt.getMonth()+1,2);
        d =  pad(dt.getUTCDate()-1,2);
        
        todayString = String(m)+"_"+String(d)+"_"+String(y); 
        
        return todayString
    }
    function getOfflineRevCode( myComp ){
        
        //var regex = /[0-9]{2}[a-z]{2}/g; //Maixmum rev number 99
        var regex = /[0-9]{2}[a-z]{2}/g; //Maixmum rev number 99
        var offlineRevCode = myComp.name.match(regex)[0];        
        return offlineRevCode;
    }
    function getFinishingRevCode( myComp ){
        
        var regex = /[0-9]{2}[a-z]{2}FIN/g; //Maixmum rev number 99
        var offlineRevCode = myComp.name.match(regex)[0];        
        return offlineRevCode;
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
        var userName = artistName.text;
        
        //coder's exceptionalism
        if ( userName = "jperez" ){
            userName = "jvasquez";
        }

        artistInitials = userName.substring(0,2);

        return artistInitials;
    }
    function versionUpSelectedComps( inc )
    {
        //really selected items, might be worth to restrict to just comps ?
        var selectedComps = getSelectedProjectItems();
        for ( var i = 0 ; i < selectedComps.length ; i ++ )
        {
            versionUpComp( selectedComps[i], inc );
        }
        

    }
    function versionUpComp( myComp, inc ){
        
        if ( artistRole.selection.index == 0 ){
            //offline
            var revCode = getOfflineRevCode( myComp );
        }else if ( artistRole.selection.index == 1 ){
            //finishing
            var revCode = getFinishingRevCode( myComp );
        }

        splitName = myComp.name.split( revCode );

        var ver = parseInt(revCode.substring(0,3));
        //alert(ver);
        //var oldArtistInitials = offlineRevCode.substring(2,5);

        var newArtistInitials = getArtistInitials();
        if ( artistRole.selection.index == 1 ){
            newArtistInitials = newArtistInitials+"FIN"
        }
        myComp.name = splitName[0]+pad(ver+inc,2)+newArtistInitials+splitName[1] ;
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

    function test(){
        var t = getItemTrunk(getSelectedProjectItems()[0]);
        var date_re = "[0-9\_]{8}"
        for ( var i = 0 ; i < t.length ; i ++ )
        {
            var date_search = t[i].name.search(date_re);
            if ( date_search == 0 )
            {
                alert(t[i].name);
            };
        }

    }


})(this);
