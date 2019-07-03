#!/usr/bin/env bash

 find ./assets/ -type f -iname '*.svg' |
    while read file;
     do
        inkscape "${file}" -d 96 -e "${file%.*}@1x.png" --without-gui;
        inkscape "${file}" -d 192 -e "${file%.*}@2x.png" --without-gui;
        inkscape "${file}" -d 288 -e "${file%.*}@3x.png" --without-gui;
     done