x = {}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log("data") // Prints data above array
    console.log(data)  // Prints the array to console
    x = data // Object passed to show data
    var sampleNames = data.names;
    console.log("sampleNames") // Prints sampleNames above array
    console.log(sampleNames)   // Prints the array to console

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    //   for (var i=0; i < sampleNames.length; i++){
    //     selector
    //         .append("option")
    //         .text(sampleNames[i])
    //         .property("value", sampleNames[i]);
    // };


    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log("resultArray") // Prints the word resultArray above the array
    console.log(resultArray)  // Prints the array to console
    x = resultArray
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).map(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

    //   for (var key in result) {
    //     PANEL.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
    // };


  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    x = data
    console.log("I'm here")
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var filtSample = resultArray[0];

    console.log("filtSample");
    console.log(filtSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = filtSample.otu_ids;
    var labels = filtSample.otu_labels;
    var values = filtSample.sample_values;
    // var bubbleLabels = filtSample.otu_labels;
    // var bubbleValues = filtSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yData = ids.slice(0, 10);
    var yLabels = [];
    yData.forEach(function (sample) {
      yLabels.push(`OTU ${sample.toString()}`);
    });
    //  var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    console.log(yLabels)

    // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: values.slice(0, 10).reverse(),
      y: yLabels.reverse(),
      text: labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: 'rgb(3,111,252)'
      }
    };

    var barData = [barTrace];


    // 9. Create the layout for the bar chart. Found several sites that show annotations examples.
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",

      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: -0.25,
        yanchor: 'center',
        text: 'The bar chart displays the group of organisms studied and<br>displays the top ten, Operational taxonomic units (OTUs).',
        showarrow: false
      }] 
      

    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          size: values,
          color: ids,
          colorscale: "Rainbow"
        }
      }];


    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<em>Bacteria Cultures Per Sample</em>",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };




    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.  

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata = metadataArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
    var frequency = parseFloat(metadata.wfreq);



    // 4. Create the trace for the gauge chart. https://plotly.com/javascript/reference/indicator/
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: frequency,
        title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "yellowgreen" },
            { range: [8, 10], color: "green" }
          ],
        }
      }
    ];


    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 425,
      margin: { t: 0, b: 0 }
    };



    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}






