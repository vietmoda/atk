import { defineStore } from 'pinia';

export const useDropdownStore = defineStore('dropdown', {
  state: () => ({
    organizationList: [
      { label: 'Ban giám đốc', value: 1 },
      { label: 'Phòng Nhân sự tổng hợp', value: 2 },
      { label: 'Phòng Kế hoạch đầu tư', value: 3 },
      { label: 'Phòng Kinh doanh', value: 4 },
    ],
    positionList: [
      { label: 'Giám đốc', value: 1 },
      { label: 'Phó giám đốc', value: 2 },
      { label: 'Trưởng phòng', value: 3 },
      { label: 'Chuyên viên', value: 4 },
    ]
  }),
  getters: {
    organizations: state => state.organizationList || [],
    positions: state => state.positionList || []
  }
})