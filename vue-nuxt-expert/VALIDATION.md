# Vue.js & Nuxt Expert Skill - Guía de Validación

## ✅ Instalación Completada

El skill `vue-nuxt-expert` ha sido instalado exitosamente en:
```
~/.agents/skills/vue-nuxt-expert/SKILL.md
```

## 🎯 Triggers Esperados

El skill se activará automáticamente en estos escenarios:

### 1. Detección de Proyecto Vue/Nuxt
Cuando abras un proyecto con estas dependencias:
```json
{
  "dependencies": {
    "vue": "^3.x",
    "nuxt": "^3.x",
    "pinia": "^2.x"
  }
}
```

### 2. Consultas Típicas que Activan el Skill

**Pinia State Management:**
- "Audita mi store de usuarios en Pinia"
- "¿Cómo migro de Options API a Composition API en Pinia?"
- "Necesito una estructura escalable de stores"

**Composition API:**
- "Debo extraer lógica a un composable"
- "¿Cuáles son las mejores prácticas de Composition API?"
- "Necesito un custom hook para lógica reutilizable"

**SSR con Nuxt:**
- "Tengo problemas de hydration mismatch en Nuxt"
- "¿Cómo configuro SSR en mi proyecto Nuxt?"
- "Necesito optimizar el renderizado en servidor"

**Performance:**
- "Mi bundle está muy grande, ¿cómo lo reduzco?"
- "El LCP es muy alto, ¿qué optimizaciones hago?"
- "Cómo implemento lazy loading en Nuxt"

**Testing:**
- "¿Cómo testeo composables y stores?"
- "Necesito configurar testing en Vue 3"
- "¿Qué herramientas recomiendan para testing E2E?"

**Arquitectura:**
- "Mi proyecto tiene circular dependencies"
- "Necesito refactorizar a arquitectura limpia"
- "¿Cuál es la mejor estructura para un proyecto Vue grande?"

## 🚀 Cómo Usar

### Opción 1: Invocación Directa (Slash Command)
```
/vue-nuxt-expert
```

Luego describe tu tarea específica.

### Opción 2: Invocación Natural en Conversación
Simplemente describe tu problema de Vue/Nuxt en lenguaje natural, y el sistema detectará automáticamente que debe usar este skill.

**Ejemplo:**
```
"Tengo una aplicación Nuxt 3 con Pinia donde los stores están usando Options API. 
Necesito migrar a Composition API pero tengo miedo de romper la aplicación.
¿Cuál es el mejor enfoque?"
```

El skill se activará automáticamente.

## 📋 Funcionalidades Principales

### 1. Auditoría Completa
El skill proporciona análisis detallado de:
- ✅ Uso correcto de Composition API vs Options API
- ✅ Estructura y patrones de Pinia
- ✅ Configuración de SSR en Nuxt
- ✅ Performance y optimizaciones
- ✅ Testing y cobertura
- ✅ Arquitectura limpia

### 2. Recomendaciones Específicas
- 📝 Ejemplos de código con TypeScript
- 🎯 Mejores prácticas actualizadas
- ✔️ Checklists de validación
- 📚 Referencias a documentación oficial

### 3. Restricciones Respetadas
- ❌ No edita archivos sin preguntar
- ❌ No genera componentes nuevos sin autorización
- ✅ Solo audita, propone y guía

## 🔍 Validación Manual

Para verificar que el skill está disponible:

```bash
# El skill debería aparecer en la lista de skills
ls -la ~/.agents/skills/vue-nuxt-expert/SKILL.md

# Contenido debería ser válido
head -5 ~/.agents/skills/vue-nuxt-expert/SKILL.md
```

## 📊 Casos de Éxito Esperados

El skill está diseñado para manejar correctamente:

1. **Proyectos Nuxt 3 con SSR**
   - Auditoría de configuración SSR
   - Recomendaciones de hidratación
   - Optimizaciones específicas

2. **Manejo de Estado Avanzado**
   - Migración de Pinia
   - Patrones reactivos
   - Persistencia de datos

3. **Optimización de Performance**
   - Bundle analysis
   - Code splitting strategy
   - Lazy loading recommendations

4. **Testing Completo**
   - Unit test setup
   - Component testing
   - E2E testing

5. **Refactoring de Arquitectura**
   - Análisis de problemas
   - Propuesta de solución
   - Plan de migración

## 🎓 Ejemplo de Interacción

**Usuario:**
```
"Tengo un proyecto Vue 3 nuevo y quiero implementar 
la mejor arquitectura desde el inicio. ¿Qué me recomiendas?"
```

**Respuesta Esperada del Skill:**
- ✅ Estructura completa de directorios
- ✅ Patrones recomendados de Pinia
- ✅ Configuración de testing
- ✅ Consideraciones de performance
- ✅ Checklist de setup

## 📞 Próximos Pasos

1. **Prueba el skill** en uno de tus proyectos Vue/Nuxt
2. **Reporta feedback** si hay mejoras necesarias
3. **Personaliza** las recomendaciones si es necesario

---

**Skill Version:** 1.0  
**Última actualización:** 2026-08-15  
**Estado:** ✅ Instalado y Listo
