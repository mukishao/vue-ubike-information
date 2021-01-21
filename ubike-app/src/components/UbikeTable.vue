<template>
    <table class="table table-striped" >
        <thead>
        <tr>
            <th v-for="header in headers" :key="header.text" @click="handleSort(header)">
                <span class="txt">
                    {{header.text}}
                    <template v-if="header.sortable">
                        <i :class="['fa fa-sort-asc', {'is-active': sortField == header.value && sortAsc}]" aria-hidden="true"></i>
                        <i :class="['fa fa-sort-desc', {'is-active': sortField == header.value && !sortAsc}]" aria-hidden="true"></i>
                    </template>
                </span>
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in currentPageFinalStops" :key="item.value" :class="{'is-pinned': item.isPinned }">
            <td v-for="(field, idx) in fields" :key="item[field]">
                <i v-if="idx == 0" class="fa fa-thumb-tack" @click="handlePin(item)"></i>
                {{item[field]}}
            </td>
        </tr>
        </tbody>

    </table>
</template>

<script>
export default {
    props:{
        // 分頁
        page:{
            default: 1
        },
        itemsPerPage: {
            default: 10
        },

        // 搜尋
        search: null,

        // 表單欄位
        fields: null,
        headers:null,
        items: null,

        // 目前排序欄位
        sortField: null,
        // 排序方式
        sortAsc: {
            default: false
        },
    },
    computed:{
        // 每頁筆數
        calcItemsPerPage() {
            return this.itemsPerPage - this.pinnedStops.length;
        },
        pages() {
            let totalItems = this.filteredStops.length;

            return Math.ceil(totalItems / this.calcItemsPerPage);
        },
        currentPageStops() {
            let startIdx = (this.page - 1) * this.calcItemsPerPage;
            let endIdx = this.page * this.calcItemsPerPage

            return this.sortedStops.slice(startIdx, endIdx);
        },
        // 當前頁面的站點
        currentPageFinalStops() {
            return this.pinnedStops.concat(this.currentPageStops)
        },
        // 搜尋
        filteredStops() {
            let newArr = [...this.noPinnedStops];
            let targetName = this.search.toLowerCase();

            // 篩選
            if (targetName) {
                newArr = newArr.filter((stop) => {
                    return stop.sna.toLowerCase().includes(targetName);
                });
            }
            return newArr;
        },
        // 排序
        sortedStops() {
            let newArr = [...this.filteredStops];
            // 排序
            if (this.sortField) {
                if ( this.sortAsc ) {
                    newArr = newArr.sort((a, b) => a[this.sortField] - b[this.sortField]);
                } else {
                    newArr = newArr.sort((a, b) => b[this.sortField] - a[this.sortField]);
                }
            }

            return newArr;
        },
        // 釘選的站點
        pinnedStops() {
            return this.items.filter(item => item.isPinned);
        },
        noPinnedStops() {
            return this.items.filter(item => !item.isPinned);
        }
    },
    methods: {
        // 排序
        handleSort(header) {
            if (header.sortable) {
                // emit new status
                this.$emit('sort-field', header.value)
                this.$emit('sort-asc', this.sortField ? !this.sortAsc: this.sortAsc)
            }
        },
        // 釘選
        handlePin(item) {
            this.$emit('pin', item, !item.isPinned)
        }
    },
    watch: {
        pages(){
            this.$emit('pages-change', this.pages)
        },
        search () {
            this.$emit('pages-change', this.pages)
            this.$emit('page-change', 1)
        }
    }
}
</script>

<style >
    table td, table th{
        text-align: center;
    }
    tr td:first-child,tr th:first-child{
        position:relative;
        padding-left: 30px;
    }
    tr td .fa{
        content:'\f08d';
        display: inline-block;
        font: normal normal normal 14px/1 FontAwesome;
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        opacity:0;
        visibility: hidden;
        cursor: pointer;
    }
    tr td:first-child:hover .fa{
        opacity:.5;
        visibility: visible;
    }
    table.table-striped tbody tr.is-pinned{
        background: lightgoldenrodyellow;
    }
    tr.is-pinned td:first-child .fa{
        color: lightsalmon;
        opacity:1;
        visibility: visible;
    }
    th{
      position:relative;
    }
    th .txt{
      position: relative;
      cursor:pointer;
    }
    th i{
      position:absolute;
      top:50%;
      transform: translateY(-50%);
      right: -13px;
      opacity:0;
    }
    th:hover .fa-sort-desc{
      opacity: 0.5;
    }
    th .fa-sort-desc.is-active, th .fa-sort-asc.is-active{
      opacity:1;
    }
    th i.is-active ~ .fa-sort-desc{
      opacity: 0;
    }
    th .fa-sort-asc {
      transform: translateY(-50%) translateY(4px);
    }
    th .fa-sort-desc {
      transform: translateY(-50%) translateY(-3px);
    }
</style>