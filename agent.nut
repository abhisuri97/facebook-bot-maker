server.log("Control w/ button: " + http.agenturl() + "?button");
server.log("Control w/ light: " + http.agenturl() + "?light");
server.log("Turn servo one way: " + http.agenturl() + "?servo=1");
server.log("Turn servo other way: " + http.agenturl() + "?servo=0");
server.log("Turn LED On: " + http.agenturl() + "?led=1");
server.log("Turn LED Off: " + http.agenturl() + "?led=0");
server.log("Turn Buzzer On: " + http.agenturl() + "?buzzer=1");
server.log("Turn Buzzer Off: " + http.agenturl() + "?buzzer=0");



//BUTTON
state <- "";
function changeState(data){
    state = data;
}
device.on("setPin", changeState)
function MainPageButton(){
    server.log(state);
    if (state == "pressed"){
        local html = "{\"Success\":\"PRESSED\"}";
        return html;
    }
    else {
        local html = "{\"SUCCESS\":\"NOT PRESSED\"}";
        return html;
    }
}

//PHOTORESISTOR
lstate <- "";

function LightChangeState(data){
    lstate = data;
}

function MainPageLight()
{
    server.log(lstate);
    
    if (lstate > 50000){
        local html = "{\"Success\":\"ON\"}";
        return html;
    }
    else {
        local html = "{\"Success\":\"OFF\"}";
        return html;
    }
}
device.on("gotReading", LightChangeState)

function httpHandler(request, response) {
    try {
        // Check if the user sent led as a query parameter
        if ("led" in request.query) {
            // If they did, and led=1.. set our variable to 1
            if (request.query.led == "1" || request.query.led == "0") {
                // Convert the led query parameter to an integer
                local ledState = request.query.led.tointeger();

                // Send "set.led" message to device, and send ledState as the data
                device.send("set.led", ledState); 
            }
            response.send(200, "{\"Success\":\"OK\"}");
        }
        if("button" in request.query) {
            response.send(200, MainPageButton());
        }
        if("light" in request.query) {
            response.send(200, MainPageLight());
        }
        if ("servo" in request.query) {
            // If they did, and led=1.. set our variable to 1
           
                local servoState = request.query.servo.tofloat();
                
                // Send "set.led" message to device, and send ledState as the data
                device.send("set.servo", servoState); 
            
        }
        if("buzzer" in request.query) {
            if (request.query.buzzer == "1" || request.query.buzzer == "0") {
                local buzzerState = request.query.buzzer.tofloat();
                device.send("set.buzzer", buzzerState); 
            }
            response.send(200, "{\"Success\":\"OK\"}");
        }
        else{
    
        // Send a response back to the browser saying everything was OK.
        response.send(200, "{\"Success\":\"OK\"}");
        }
    } catch (ex) {
        response.send(500, "Internal Server Error: " + ex);
    }
}

/* REGISTER HTTP HANDLER -----------------------------------------------------*/
http.onrequest(httpHandler);
