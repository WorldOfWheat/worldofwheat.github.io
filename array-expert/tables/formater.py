###################################################
# Author: 小麥
# Description: 
# This script is used to format the array 30 data that from official website to json format.
###################################################

from enum import Enum
import json

# Array 30 short code type
class Code_Type(Enum):
    LEVEL1 = 1
    LEVEL2 = 2
    SPECIAL = 3    

class Formater:
    # convert data to json format
    def __to_json(self, data):
        return json.dumps(data, indent=4, sort_keys=True, ensure_ascii=False)

    # preprocess level 1, 2 code 
    def __level12_preprocess(self, data):
        result = []
        counter = 1
        for line in data: # read line by line
            split_data = line.split('\t') # split by tab
            split_data[-1] = split_data[-1].strip() # remove new line symbol
            split_data.append(counter % 10) # append selection number
            result.append(split_data)

            # selection number counter control
            counter += 1
            if (counter == 11):
                counter = 1

        return result

    # format level 1, 2 code
    def __level12_format(self, data):
        result = {}
        for line in data: # read line by line
            # if key not exist, create a new list
            if line[0] not in result:
                result[line[0]] = []
                
            # append first key, selection key and character
            result[line[0]].append((line[1], line[2]))

        return result

    # special code preprocessing
    def __special_preprocess(self, data):
        result = []
        for line in data: # read line by line
            split_data = line.split('\t') # split by tab
            split_data[-1] = split_data[-1].strip() # remove new line symbol
            result.append(split_data)

        return result

    # format special code
    def __special_format(self, data):
        result = []
        for line in data: # read line by line
            # append special code and character
            result.append({line[0]: line[1]})

        return result

    # convert data to json format
    def convert_to_json(self, data, type):
        dictionary_data = {};
        match type:
            case Code_Type.LEVEL1:
                preprocessed_data = self.__level12_preprocess(data)
                dictionary_data = self.__level12_format(preprocessed_data)
            case Code_Type.LEVEL2:
                preprocessed_data = self.__level12_preprocess(data)
                dictionary_data = self.__level12_format(preprocessed_data)
            case Code_Type.SPECIAL:
                preprocessed_data = self.__special_preprocess(data)
                dictionary_data = self.__special_format(preprocessed_data)
        return self.__to_json(dictionary_data)

# handle input file
def input(file_name):
    result = []
    with open(file_name) as f:
        result = f.readlines()
    return result

def main():
    formater = Formater()

    # define table files path
    table_files = {
        ('一級簡碼.txt', Code_Type.LEVEL1),
        ('二級簡碼.txt', Code_Type.LEVEL2),
        ('特別碼.txt', Code_Type.SPECIAL)
    }

    for table in table_files:
        table_data = input(table[0])
        json_data = formater.convert_to_json(table_data, table[1])
        with open(table[0].split('.')[0] + '.json', 'w+') as f:
            f.write(json_data)


if __name__ == '__main__':
    main()