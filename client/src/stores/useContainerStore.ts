import {create } from 'zustand'

interface ContainerState {
    width: number, 
    height: number,
    setSize: (width:number, height:number) => void;
    setWidth:(width:number) => void;
    setHeight: (height: number) => void;
}

export const useContainerStore = create<ContainerState>((set) => ({
    width: 300,
    height: 200, 
    setSize: (width, height) => set({width, height}),
    setWidth: (width) => set({width}),
    setHeight: (height) => set({height})
}

))