t SERVO_MIN = 0.03;
const SERVO_MAX = 0.1;
servo <- hardware.pin7;
servo.configure(PWM_OUT, 0.02, SERVO_MIN);
servo.write(1);

function sweep(state) {
    servo.write(state);
}

agent.on("set.servo", sweep);

//BUTTON
button <- hardware.pin2;

function buttonPress(){
    local state = button.read();
    if (state == 1) {
        // The button is released
        server.log("Release");
        agent.send("setPin", "released");
    } else {
        // The button is pressed
        server.log("Press");
        agent.send("setPin", "pressed");
    }
}

button.configure(DIGITAL_IN_PULLUP, buttonPress);

//PHOTORESISTOR
light <- hardware.pin8;

function getLightVal(){
    local state = light.read();
    agent.send("gotReading", state);
    imp.wakeup(1, getLightVal);
}

light.configure(ANALOG_IN);
getLightVal();


//LED
led <- hardware.pin1;
led.configure(DIGITAL_OUT, 0);

function setLedState(state) {
    server.log("Set LED to state: " + state);
    led.write(state);
}
agent.on("set.led", setLedState);

//BUZZER
buzzer <- hardware.pin5;
buzzer.configure(DIGITAL_OUT, 0);

function setBuzzerState(state) {
    server.log("Set Buzzer to state: " + state);
    buzzer.write(state);
}
agent.on("set.buzzer", setBuzzerState);

