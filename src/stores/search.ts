import { defineStore } from 'pinia'
import { dasStore } from './das'

export const searchStore = defineStore('search', {
  state: () => ({
    results: [],
    searchQuery: '',
  }),

  getters: {
    filtredRequests(state) {
      const das = dasStore();
      let results = [];
      let query = ''
      if (state.searchQuery) {
        results = das.requestList
        query = state.searchQuery.toLowerCase();
      };

      return results.filter(result => {
        if (result.number_str && result.number_str.toLowerCase().includes(query)) return true;
        if (result.title && result.title.toLowerCase().includes(query)) return true;
        if (result.initiator?.fullname && result.initiator.fullname.toLowerCase().includes(query)) return true;
        if (result.description && result.description.toLowerCase().includes(query)) return true;
        if (result.deadline_str && result.deadline_str.toLowerCase().includes(query)) return true;
        if (result.created_at_str && result.created_at_str.toLowerCase().includes(query)) return true;
        if (result.approval_chain && Array.isArray(result.approval_chain)) {
          const foundInApprovalChain = result.approval_chain.some(stage =>
            stage.approvals && Array.isArray(stage.approvals) &&
            stage.approvals.some(approval =>
              approval.user?.fullname && approval.user.fullname.toLowerCase().includes(query)
            )
          );
          if (foundInApprovalChain) return true;
        }
        if (result.observers && Array.isArray(result.observers)) {
          const foundInObservers = result.observers.some(observer =>
            observer?.fullname && observer.fullname.toLowerCase().includes(query)
          );
          if (foundInObservers) return true;
        }
        return false;
      });
    },
    limitedResults() {
      return this.filtredRequests.slice(0, 7);
    }
  }
});
