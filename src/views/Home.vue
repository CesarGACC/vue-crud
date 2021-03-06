<template>
  <div class="home">
    <div>
      <div class="table-header">
          <h1>Manage Products</h1>

      </div>
      <div class="table-header">
        <Button label="New" icon="pi pi-plus" class="p-button-success" @click="handleCreateClick($event)"/>
        <Button label="Submit" class="p-button-raised p-button-rounded" @click="handleSubmitClick($event)"/>
      </div>
    </div>

    
        <Dialog v-model:visible="productDialog" :style="{width: '450px'}" header="Product Details" :modal="true" class="p-fluid">
            <div class="p-field">
                <label for="name">Name</label>
                  <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{'p-invalid': submitted && !product.name}" />
                <small class="p-error" v-if="submitted && !product.name">Name is required.</small>
            </div>

            <div class="p-formgrid p-grid">
                <div class="p-field p-col">
                    <label for="price">Price</label>
                      <InputNumber id="price" v-model="product.price" required="true" mode="currency" currency="USD" locale="en-US" :class="{'p-invalid': submitted && !product.price}"/>
                    <small class="p-error" v-if="submitted && !product.price">Price is required.</small>
                </div>
                <div class="p-field p-col">
                    <label for="quantity">Quantity</label>
                      <InputNumber id="quantity" v-model="product.quantity" required="true" integeronly :class="{'p-invalid': submitted && !product.quantity}"/>
                    <small class="p-error" v-if="submitted && !product.quantity">Quantity is required.</small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="productHistoryDialog" v-if="historyChartReady" :style="{width: '800px'}" header="Product History" :modal="true" class="p-fluid">
            <div class="Chart">
              <h4>{{productHistory.name}}</h4>
              <div>
                <Chart :key="series" v-if="historyChartReady" :chartOptions="chartOptions" :series="series"/>
              </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideHistoryDialog"/>
            </template>
        </Dialog>

        <div>
          <DataTable :value="list" :key="list" editMode="cell" @cellEditComplete="onCellEditComplete" class="editable-cells-table" responsiveLayout="scroll" >
            <Column field="id" header="Id" style="width:20%; heigth:30%;" background="">
                <template #editor="slotProps">
                  {{slotProps.data[slotProps.column.props.field]}}
                </template>
            </Column>
            <Column field="name" header="Name" style="width:20%; heigth:30%;">
                <template #editor="slotProps">
                    <InputText :modelValue="slotProps.data[slotProps.column.props.field]"  @update:modelValue="onCellEdit($event, slotProps)"/>
                </template>
            </Column>
            <Column field="price" header="Price" mode="currency" currency="USD" locale="en-US" style="width:20%; heigth:30%;">
                <template #editor="slotProps">
                    <InputNumber :modelValue="slotProps.data[slotProps.column.props.field]"  @update:modelValue="onCellEdit($event, slotProps)"/>
                </template>
            </Column>
            <Column field="quantity" header="Quantity" style="width:20%; heigth:30%;">
                <template #editor="slotProps">
                    <InputNumber :modelValue="slotProps.data[slotProps.column.props.field]"  @update:modelValue="onCellEdit($event, slotProps)"/>
                </template>
            </Column>
            <Column :exportable="false">
                <template #body="slotProps">
                    <Button icon="pi pi-table" class="p-button-rounded p-mr-2" @click="handleHistoryClick(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="handleDeleteClick(slotProps.data)" />
                </template>
            </Column>
          </DataTable>
        </div>
  </div>
</template>

<script>
// @ is an alias to /src
import api from "../service/LaravelApi";
import Chart from '../components/LineChart.vue'

export default {
  name: 'Home',
  components:{
    Chart
  },
  data()
  {
    return {
      chartOptions: {
        chart: {
          id: 'Line-Chart'
        },
        xaxis: {
          categories: []
        }
      },
      series: [{
        name: 'Quantity',
        data: []
      },{
        name: 'Price',
        data: []
      },
      
      ],  
      edited:false,
      product: {},
      newProducts:[],
      editingCellRows: [],
      newRows: [],
      submitted: false,
      productDialog: false,
      productHistoryDialog: false,
      productHistory:undefined,
      historyChart:[],
      historyChartReady:false,
      columns:undefined,
      list:undefined,
    }
  },
  originalRows: null,
  created() {
    this.api = new api();
    this.columns = [
        {id:0, field: 'id', header: 'Id', edited: false},
        {id:1, field: 'name', header: 'Name', edited: false},
        {id:2, field: 'price', header: 'Price', edited: false},
        {id:3, field: 'quantity', header: 'Quantity', edited: false}
    ];

  },
  async mounted()
  {
    await this.api.getProducts().then(data => this.list = data);
  },

  methods: {

    onCellEditComplete(event) {
        if (!this.editingCellRows[event.index]) {
            return;
        }

        const editingCellValue = this.editingCellRows[event.index][event.field];

        switch (event.field) {
            case 'id':
              event.preventDefault();
            break;
            case 'quantity':
            case 'price':
                if (this.isPositiveInteger(editingCellValue))
                    this.list[event.index] = {...this.editingCellRows[event.index]};
                else
                    event.preventDefault();
            break;

            default:
                if (editingCellValue.trim().length > 0)
                    this.list[event.index] = {...this.editingCellRows[event.index]};
                else
                    event.preventDefault();
            break;
        }
    },

    onCellEdit(newValue, props) {
      if (!this.editingCellRows[props.index]) {
          this.editingCellRows[props.index] = {...props.data};
      }

      this.editingCellRows[props.index][props.column.props.field] = newValue;
    },

    isPositiveInteger(val) {
        let str = String(val);
        str = str.trim();
        if (!str) {
            return false;
        }
        str = str.replace(/^0+/, "") || "0";
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 0;
    },

    hideDialog() 
    {
      this.productDialog = false;
      this.submitted = false;
    },

    hideHistoryDialog() 
    {
      this.productHistory = null;
      this.productHistoryDialog = false;
      this.historyChart = null;
      this.historyChartReady = true;
      this.series[0].data = [];
      this.series[1].data = [];
      this.chartOptions.xaxis.categories = [];
    },

    async saveProduct() {
      this.submitted = true;
      
			if(this.product.name.trim()) 
      {
        console.log("Product created: ",this.product)
        this.newProducts = [...this.newProducts,{"name":this.product.name,"price":this.product.price,"quantity":this.product.quantity}];
        this.productDialog = false;
        this.product = undefined;

        await this.api.createProducts(this.newProducts);
        this.newProducts = [];

        await this.api.getProducts().then(data => this.list = data);
      }
    },

    async handleSubmitClick()
    {
      await this.api.editProducts(this.editingCellRows);
      this.editingCellRows = [];

      await this.api.createProducts(this.newProducts);
      this.newProducts = [];

      await this.api.getProducts().then(data => this.list = data);
    },

    handleCreateClick()
    {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    },

    async handleHistoryClick(product)
    {
      let id = product.id;
      this.productHistory = product;
      const data = await this.api.getProductHistoryInChart(id);
      this.series[0].data = [];
      this.series[1].data = [];
      this.chartOptions.xaxis.categories = [];
      let i=0;
      data.forEach(d => {
        const {
          quantity,
          price,
        } = d;

        //this.historyChart.push({created_at, total: quantity});
        this.series[0].data.push(quantity)
        this.series[1].data.push(price)
        this.chartOptions.xaxis.categories.push(i);
        i++;
      });
      this.historyChartReady = true;
      console.log(this.series[0].data);
      console.log(this.chartOptions.xaxis.categories);
      this.productHistoryDialog = true;
    },

    async handleDeleteClick(product)
    {
  
      await this.api.deleteProduct(product);

      await this.api.getProducts().then(data => this.list = data);
    }

  }
}

</script>

<style scoped>
.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #e2e2e2;
}

.edit-background {
  background: #fff0c3;
}
</style>