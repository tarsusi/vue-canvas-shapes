import Vue from 'vue';
import Vuex from 'vuex';
import Shape from '@/models/Shape';
import Coordinate from '@/models/Coordinate';

Vue.use(Vuex);

interface HistoryItem {
  shapes: Shape[];
  corners: Coordinate[];
  selectedShapeId: number;
}

interface CanvasState {
  canvasHistory: HistoryItem[];
}

export default new Vuex.Store({
  state: {
    canvasHistory: [],
  } as CanvasState,
  mutations: {
    addHistory(state: CanvasState, historyItem: HistoryItem) {
      state.canvasHistory.push(historyItem);
    },
    undoHistory(state: CanvasState) {
      if (state.canvasHistory.length !== 1) {
        state.canvasHistory.pop();
      }
    },
  },
  getters: {
    lastItem: (state) => state.canvasHistory[state.canvasHistory.length - 1],
  },
  actions: {},
  modules: {},
});
