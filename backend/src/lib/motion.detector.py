from gpiozero import MotionSensor
import time
# import os

print("start", flush=True)
pir = MotionSensor(14)
print(os.environ.get('GPIO_PIN'))
while True:
    pir.wait_for_motion()
    print("motion-start", flush=True)
    time.sleep(5)
    pir.wait_for_no_motion()
    print("motion-stop", flush=True)