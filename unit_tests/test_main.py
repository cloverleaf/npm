import pytest
import json
import subprocess
import sys


sites = {}

with open("../data/sites.json", 'r') as json_file:
    sites = json.load(json_file)


def test_all_presets():

    results = {}

    with open("results.json", 'r') as json_file:
        results = json.load(json_file)

    test_password = "Test password"

    with open("configs.json", 'r') as json_file:
        configs = json.load(json_file)

        for config in configs:

            for site in sites:

                siteCMD = site.replace("\'", "\\'").replace(" ", "\\ ")
                password = configs[config]["password"]
                length = configs[config]["length"]

                batcmd = "node -e \"console.log(require('../index').process('{}', '{}', {}, true, 'new'))\"".format(siteCMD, password, length)

                response = subprocess.check_output(batcmd, shell=True).decode("utf-8")

                if config not in results:
                    print("Adding {} config".format(config))
                    results[config] = {}

                if site in results[config]:
                    assert response == results[config][site]["result"], "Preset \"{}\" not functioning correctly.".format(site)

                else:
                    print("Adding {} to config {}".format(site, config))
                    results[config][site] = {"result": response}

    with open("results.json", 'w', encoding='utf-8') as json_file:
        json.dump(results, json_file, ensure_ascii=False, indent=4)
