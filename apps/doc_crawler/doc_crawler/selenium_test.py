from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Firefox()
driver.get(
    'https://portal2.internal.us-east-2.service.guidewire.net/portal/secure/doc/bc/BillingCenter_3.0.4/doc')
try:
    element = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.TAG_NAME, 'frameset'))
    )
    frames = driver.find_elements_by_tag_name('frame')
    for f in frames:
        print(f.get_attribute('src'))
    driver.implicitly_wait(10)
    driver.switch_to.frame(1)
    subframes = driver.find_elements_by_tag_name('frame')
    for sf in subframes:
        print(sf.get_attribute('src'))
    driver.implicitly_wait(10)
    driver.switch_to.frame(1)
    links = driver.find_elements_by_tag_name('a')
    for l in links:
        print(l.get_attribute('href'))
finally:
    driver.quit()
