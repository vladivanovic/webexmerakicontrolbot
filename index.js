function MessageHandler(context, event) {
    var msg0 = event.message;
    msg0 = msg0.toString();
    msg0 = msg0.split(" ");
    //query = msg0[1] - Removed 18/01/2017
    query = msg0.slice(1,msg0.length);
    query = query.join(" ");
    switch(msg0[0]) {
        case "hello":
            context.sendResponse("Hello " + event.sender);
            break;
        case "key":
            var merakidashkey = context.simpledb.roomleveldata.merakidashkey;
            if (!merakidashkey) {
                context.simpledb.roomleveldata.merakidashkey = query;
                context.sendResponse("Your Meraki Dashboard Key is now set")
            } else if (!query) {
                context.sendResponse("Confirming that your Meraki Dashboard Key is " + merakidashkey);
            } else {
                context.simpledb.roomleveldata.merakidashkey = query;
                context.sendResponse("Your Meraki Dashboard Key is now updated");
            }
            break;
        case "orgs":
            var url = "https://n70.meraki.com/api/v0/organizations";
            var merakidashkeyOut = context.simpledb.roomleveldata.merakidashkey;
            var header = {"X-Cisco-Meraki-API-Key":merakidashkeyOut};
            context.simplehttp.makeGet(url,header,merakiOrgs);
            break;
        case "org":
            var merakiOrg = context.simpledb.roomleveldata.merakiorg;
            if (!merakiOrg) {
                context.simpledb.roomleveldata.merakiorg = query;
                context.sendResponse("Your Meraki Organisation is now set")
            } else if (!query) {
                context.sendResponse("Confirming that your Meraki Organisation is " + merakiorg);
            } else {
                context.simpledb.roomleveldata.merakiorg = query;
                context.sendResponse("Your Meraki Organisation is now updated");
            }
            break;
        case "networks":
            var merakiOrg2 = context.simpledb.roomleveldata.merakiorg;
            var urlnetworks = "https://n70.meraki.com/api/v0/organizations/" + merakiOrg2 + "/networks";
            var merakidashkeyOut2 = context.simpledb.roomleveldata.merakidashkey;
            var header2 = {"X-Cisco-Meraki-API-Key":merakidashkeyOut2};
            context.simplehttp.makeGet(urlnetworks,header2,merakiNetworks);
            break;
        case "network":
            var merakiNetwork = context.simpledb.roomleveldata.merakinetwork;
            if (!merakiNetwork) {
                context.simpledb.roomleveldata.merakinetwork = query;
                context.sendResponse("Your Meraki Network is now set")
            } else if (!query) {
                context.sendResponse("Confirming that your Meraki Network is " + merakiNetwork);
            } else {
                context.simpledb.roomleveldata.merakinetwork = query;
                context.sendResponse("Your Meraki Network is now updated");
            }
            break;
        case "devices":
            var merakiOrg3 = context.simpledb.roomleveldata.merakiorg;
            var merakiNetwork2 = context.simpledb.roomleveldata.merakinetwork;
            var urldevices = "https://n70.meraki.com/api/v0/organizations/" + merakiOrg3 + "/networks/" + merakiNetwork2 + "/devices";
            var merakidashkeyOut3 = context.simpledb.roomleveldata.merakidashkey;
            var header3 = {"X-Cisco-Meraki-API-Key":merakidashkeyOut3};
            context.simplehttp.makeGet(urldevices,header3,merakiDevices);
            break;
        case "help":
            context.sendResponse("Start by typing 'key <your dashboard key>' to set this parameter\nthen try 'orgs' to see organisations then 'org <org#>' to set it\nthen try 'networks' to list all networks and 'network <network ID>' to set it\n last is to use 'devices' to list them out");
            break;
        default:
            context.sendResponse("Please type 'help' for more information");
            break;
    }
}

function merakiOrgs(context, event) {
    context.console.log("Loaded Orgs Parsing");
    var ids = [];
    var names = [];
    var orgResults = JSON.parse(event.getresp);
    for (i = 0; i < 1; i++) {
        var id = orgResults[i]["id"];
        var name = orgResults[i]["name"];
        if (!id) {
            break;
        } else {
            ids.push(id);
            names.push(name);
        }
    }
    context.sendResponse(ids + " " + names);
}

function merakiNetworks(context, event) {
    context.console.log("Loaded Networks Listing");
    var networks = [];
    var networkIDs = [];
    var networkResults = JSON.parse(event.getresp);
    for (i = 0; i < 1; i++) {
        var network = networkResults[i]["name"];
        var networkID = networkResults[i]["id"];
        if (!network) {
            break;
        } else {
            networks.push(network);
            networkIDs.push(networkID);
        }
    }
    context.sendResponse(networks + " " + networkIDs);
}

function merakiDevices(context, event) {
    context.console.log("Loaded Devices Listing");
    var totalDevices = [];
    var deviceResults = JSON.parse(event.getresp);
    for (i = 0; i < 3; i++) {
        var devicename = deviceResults[i]["name"];
        var devicemodel = deviceResults[i]["model"];
        var deviceserial = deviceResults[i]["serial"];
        totalDevices.push(devicename);
        totalDevices.push(devicemodel);
        totalDevices.push(deviceserial);
        }
    context.sendResponse(totalDevices);
}

/** Functions declared below are required **/
function EventHandler(context, event) {
    if(! context.simpledb.botleveldata.numinstance)
        context.simpledb.botleveldata.numinstance = 0;
    numinstances = parseInt(context.simpledb.botleveldata.numinstance) + 1;
    context.simpledb.botleveldata.numinstance = numinstances;
    context.sendResponse("Thanks for adding me. You are:" + numinstances);
}

function HttpResponseHandler(context, event) {
    // if(event.geturl === "http://ip-api.com/json")
    context.sendResponse(event.getresp);
}

function DbGetHandler(context, event) {
    context.sendResponse("testdbput keyword was last get by:" + event.dbval);
}

function DbPutHandler(context, event) {
    context.sendResponse("testdbput keyword was last put by:" + event.dbval);
}


//###### 
//Auto generated code from devbox
//######
 
exports.onMessage = MessageHandler;
exports.onEvent = EventHandler;
exports.onHttpResponse = HttpResponseHandler;
exports.onDbGet = DbGetHandler;
exports.onDbPut = DbPutHandler;
if(typeof LocationHandler == 'function'){exports.onLocation = LocationHandler;}
if(typeof  HttpEndpointHandler == 'function'){exports.onHttpEndpoint = HttpEndpointHandler;}
