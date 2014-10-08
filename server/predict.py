#! /usr/bin/env python
#coding=utf-8

import sys
import os
import re
import time
import argparse
from random import randint

def main():
    # parse the argument
    parser = argparse.ArgumentParser()
    parser.add_argument('-output', metavar = 'String',  default = '',
        help = 'specify the output file')
    parser.add_argument('-smiles', metavar = 'String',  default = '',
        help = 'specify the smiles file')
    args = parser.parse_args()
    
    infile = open(args.smiles, 'r');
    content = infile.readline();
    outfile = open(args.output, 'w');
    time.sleep(10);
    outfile.write(content);
    infile.close();
    outfile.close();

if __name__ == "__main__":
    sys.exit(main())