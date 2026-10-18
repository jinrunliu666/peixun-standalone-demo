<template>
  <div class="empty" :class="{ compact }"><div class="empty-symbol"><BookOpen v-if="icon === 'book'" :size="27" /><CalendarDays v-else-if="icon === 'calendar'" :size="27" /><ClipboardCheck v-else-if="icon === 'exam'" :size="27" /><ChartNoAxesCombined v-else-if="icon === 'chart'" :size="27" /><FileText v-else :size="27" /></div><strong>{{ title }}</strong><p>{{ description }}</p></div>
</template>

<script setup>
import { BookOpen, CalendarDays, ClipboardCheck, ChartNoAxesCombined, FileText } from 'lucide-vue-next';
defineProps({ title: String, description: String, icon: String, compact: Boolean });
</script>
