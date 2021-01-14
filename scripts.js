const vm = Vue.createApp({
  data() {
    return {
      // 站點
      uBikeStops: [],
      // 分頁
      itemsPerPage: 50,
      currentPage: 1,
      // 搜尋欄位
      searchName: "",
      // 目前Hover欄位
      hoveredField: "",
      // 目前排序欄位
      sortField: "",
      // 排序方式
      sortOrder: "",
    };
  },
  methods: {
    timeFormat(t) {
      var date = [],
        time = [];

      date.push(t.substr(0, 4));
      date.push(t.substr(4, 2));
      date.push(t.substr(6, 2));
      time.push(t.substr(8, 2));
      time.push(t.substr(10, 2));
      time.push(t.substr(12, 2));

      return date.join("/") + " " + time.join(":");
    },
    goPage(targetPage) {
      if (targetPage >= 1 && targetPage <= this.pages) {
        this.currentPage = targetPage;
      }
    },
    handleSort(filed) {
      if (this.sortField !== filed) {
        // 變換欄位
        this.sortOrder = "desc";
        this.sortField = filed;
      } else {
        // 變換排序
        if (this.sortOrder == "desc") {
          this.sortOrder = "asc";
        } else {
          this.sortOrder = "desc";
        }
      }
    },
  },
  created() {
    // 欄位說明請參照:
    // http://data.taipei/opendata/datalist/datasetMeta?oid=8ef1626a-892a-4218-8344-f7ac46e1aa48

    // sno：站點代號、 sna：場站名稱(中文)、 tot：場站總停車格、
    // sbi：場站目前車輛數量、 sarea：場站區域(中文)、 mday：資料更新時間、
    // lat：緯度、 lng：經度、 ar：地(中文)、 sareaen：場站區域(英文)、
    // snaen：場站名稱(英文)、 aren：地址(英文)、 bemp：空位數量、 act：全站禁用狀態

    fetch("https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz")
      .then((res) => res.json())
      .then((res) => {
        // 將 json 轉陣列後存入 this.ubikeStops
        this.uBikeStops = Object.keys(res.retVal).map((key) => res.retVal[key]);
      });
  },
  computed: {
    // 分頁
    pages() {
      let totalItems = this.filteredStops.length;
      return Math.ceil(totalItems / this.itemsPerPage);
    },
    // 當前頁面的站點
    currentPageStops() {
      let startIdx = (this.currentPage - 1) * this.itemsPerPage;
      let endIdx = this.currentPage * this.itemsPerPage;

      return this.filteredStops.slice(startIdx, endIdx);
    },
    // 篩選
    filteredStops() {
      let newArr = [...this.uBikeStops];
      let targetName = this.searchName.toLowerCase();

      // 塞選
      if (targetName) {
        newArr = newArr.filter((stop, idx) => {
          return stop.sna.toLowerCase().includes(targetName);
        });
      }

      // 排序
      if (this.sortField) {
        if (this.sortOrder == "asc") {
          newArr = newArr.sort((a, b) => a[this.sortField] - b[this.sortField]);
        } else {
          newArr = newArr.sort((a, b) => b[this.sortField] - a[this.sortField]);
        }
      }

      return newArr;
    },
  },
}).mount("#app");
