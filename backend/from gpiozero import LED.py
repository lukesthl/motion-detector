from gpiozero import LED
from gpiozero import MotionSensor
from yeelight import Bulb, discover_bulbs
import time

#green_led = LED(17)
pir = MotionSensor(14)
#green_led.off()
# Connect to bulb
bulb = Bulb("192.168.178.57")
bulbs = discover_bulbs()
print(bulbs)

while True:
    pir.wait_for_motion()
    # Turn on bulb
    bulb.turn_on(effect="sudden")
    # Turn off bulb
    bulb.turn_off()
    print("Motion detected")
    time.sleep(5)
    #green_led.on()
    pir.wait_for_no_motion()
    #green_led.off()
    print("Motion stopped")