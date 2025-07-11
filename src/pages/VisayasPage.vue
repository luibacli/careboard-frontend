<template>
   <div>
    <h1>This is Visayas Page</h1>
   </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useCareGroupStore } from '../stores/careGroupStore';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const careGroupStore = useCareGroupStore();

const route = useRoute();

const totalPublic = computed(() => {
   return {
      registered: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.registered, 0),
      fpe: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpe, 0),
      fpc: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpc, 0)
   }
})

const totalPrivate = computed(() => {
   return {
      registered: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.registered, 0),
      fpe: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpe, 0),
      fpc: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpc, 0)
   }
})

const { fetchCareGroupSummaryByRegion } = careGroupStore;
const {allCareGroupsByRegion, loading, publicCareGroupsByRegion, privateCareGroupsByRegion, totalFpcByRegion, totalFpeByRegion, totalRegisteredByRegion} = storeToRefs(careGroupStore)

const regionName = route.name

onMounted( async () => {
   await fetchCareGroupSummaryByRegion(regionName)
})
</script>