//STEP 3 - Chart Configurations
const chartConfig = {
type: 'vled',
renderAt: 'chart-container',
width: '100%',
height: '400',
dataFormat: 'json',
dataSource: 
	{
		// Chart Configuration
		"chart": {
			"caption": "Resultado de Cuestionario",
			"lowerLimitDisplay": "Deficiente",
			"upperLimitDisplay": "Excelente",
			"numberSuffix": "%",
			"tickMarkDistance": "5",
			"alignCaptionWithCanvas": "1",
			"captionAlignment": "center",
			"theme": "fusion"
		},
		"colorRange": {
			"color": [
				{
					"minValue": "0",
					"maxValue": "35",
					"code": "#c02d00"
				},
				{
					"minValue": "35",
					"maxValue": "70",
					"code": "#f2c500"
				},
				{
					"minValue": "70",
					"maxValue": "100",
					"code": "1aaf5d"
				}
			]
		},
		"value": 57,
	}
};
FusionCharts.ready(function(){
	var fusioncharts = new FusionCharts(chartConfig);
	fusioncharts.render();
});
