import {create } from 'zustand'

interface ContainerState {
    width: number, 
    height: number,
    fontSize: number,
    setSize: (width:number, height:number) => void;
    setWidth:(width:number) => void;
    setHeight: (height: number) => void;
}


const BASE_WIDTH = 250;
const BASE_FONT_SIZE = 16; // px

export const useContainerStore = create<ContainerState>((set) => ({
    width: BASE_WIDTH,
    height: 1400, 
    fontSize: BASE_FONT_SIZE, 
    setSize: (width, height) => 
        set({
            width, 
            height, 
            fontSize: (width /BASE_WIDTH) * BASE_FONT_SIZE }),
    setWidth: (width) => set({width}),
    setHeight: (height) => set({height})
}

))