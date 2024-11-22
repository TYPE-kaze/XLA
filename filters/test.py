import pathlib
import sys

with open('test.log', 'w') as f:
    f.write("CWD: " + str(pathlib.Path().absolute()) + "\n")

    # total arguments
    n = len(sys.argv)
    f.write("Total arguments passed: " + str(n))

    # Arguments passed
    f.write("\nName of Python script:" + sys.argv[0])

    f.write("\nArguments passed:")
    for i in range(1, n):
        f.write(sys.argv[i] + " ")
    
    # # Addition of numbers
    # Sum = 0
    # # Using argparse module
    # for i in range(1, n):
    #     Sum += int(sys.argv[i])
        
    # print("\n\nResult:", Sum)