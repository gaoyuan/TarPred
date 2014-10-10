# !/usr/bin/env python
# -*- coding: utf-8 -*-
# @babyface
# 2014-09-11

from __future__ import division   
import os
import re
import sys
import argparse
import textwrap
import shutil
import pickle
import numpy as np

def result_formatting(query,topN):

    filename = query.split('.')[0]
    resultpath = os.getcwd() +'\\'+ filename
    
    fusionScore = {}
    topn = topN

    for f in os.listdir(resultpath):
        if '.tani' in f:
            fin = open(resultpath+'\\'+f,'r')
            simlist = []
            target = f[:f.find('.')]
            for line in fin.readlines()[1:]:
                its = line.strip().split('\t')
                simlist.append([int(its[0]),float(its[1])])
            simlist.sort(key= lambda l: l[1])        # sort the scores for the target
            fin.close()
            index = np.array(simlist)[:,0][:3]
            fs = -(np.sum(np.array(simlist)[0:3,1])/3-1)        # fusion score
            fusionScore[target] = [index,fs]        # fusionScore[target] = [smile index,3nn score]
    fusionScore = sorted(fusionScore.iteritems(), key=lambda d:d[1][1], reverse = True)[:topn]        # sort the scores for all targets

    return fusionScore


def NearestStructure(query,fusionScore,d,Target_smi):
    
    resultpath = os.getcwd() +'\\results'
    filename = query.split('.')[0]
    fout = open(resultpath+'\\'+'%s.csv'%filename,'w')
    fout.write('Target_id    Target_name    3NN_score    Similar_smiles\n')
    
    n = 0
    for info in fusionScore:
        n += 1
        target,ligand = info
        targetname = ';'.join(d[target])
        ligand_id_list = list(ligand[0])
        smiles = Target_smi[target]
        smiles = [smiles[int(ligandid)-1] for ligandid in ligand_id_list]
        fout.write(target+'\t'+targetname+'\t'+str(ligand[1])+'\t'+'['+';'.join(smiles)+']'+'\n')

    fout.close()

def removefiles(query):
    filename = query.split('.')[0]
    resultpath = os.getcwd() +'\\'+ filename
    shutil.rmtree(resultpath)
    os.remove(query)
    
def main():
    p =argparse.ArgumentParser()
    p.add_argument('-query',  required=True, help='smi/mol/sdf file(required), The query molecule, ')
    p.print_help()

    args = p.parse_args()
    query = args.query

    fname = open(os.getcwd()+ '\\RefBase\\'+'Target_ID2Name.pickle','rb')
    d = pickle.load(fname)
    fname.close()

    fin = open(os.getcwd()+ '\\RefBase\\'+'Ref_Target_smi.pickle','rb')
    Target_smi = pickle.load(fin)
    fin.close()

    fusionScore = result_formatting(query,30)
    NearestStructure(query,fusionScore,d,Target_smi)

    removefiles(query)

if __name__ == '__main__':
    main()