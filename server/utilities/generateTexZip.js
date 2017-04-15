
const AdmZip = require('adm-zip')

const {
  table_2_1,
  table_3_1,
  table_4_1,
  table_4_2,
  table_5,
  table_7,
  table_8_2,
  table_8_3,
} = require('./tablesData')

module.exports = function generateTexZip () {
  const zip = new AdmZip()
  
  return hbs.getTemplates('tex', { /* precompiled: true */ })
  .then((templates) => {
    return Promise.all([
      table_2_1(),
      table_3_1(),
      table_4_1(),
      table_4_2(),
      table_5(),
      table_7(),
      table_8_2(),
      table_8_3(),
    ])
    .then((data) => {
      return [templates, data]
    })
  })
  .then(([templates, data]) => {
    
    zip.addFile('table_2_1.tex', new Buffer(templates['table_2_1.tex.handlebars']({ data: data[0] })), '', 0644)
    zip.addFile('table_3_1.tex', new Buffer(templates['table_3_1.tex.handlebars']({ data: data[1] })), '', 0644)
    zip.addFile('table_4_1.tex', new Buffer(templates['table_4_1.tex.handlebars']({ data: data[2] })), '', 0644)
    zip.addFile('table_4_2.tex', new Buffer(templates['table_4_2.tex.handlebars']({ data: data[3] })), '', 0644)
    zip.addFile('table_5.tex', new Buffer(templates['table_5.tex.handlebars']({ data: data[4] })), '', 0644)
    zip.addFile('table_7.tex', new Buffer(templates['table_7.tex.handlebars']({ data: data[5] })), '', 0644)
    zip.addFile('table_8_2.tex', new Buffer(templates['table_8_2.tex.handlebars']({ data: data[6] })), '', 0644)
    zip.addFile('table_8_3.tex', new Buffer(templates['table_8_3.tex.handlebars']({ data: data[7] })), '', 0644)
    
    return zip.toBuffer()
  })
}
