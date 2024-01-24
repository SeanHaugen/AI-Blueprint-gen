///notes
//prompt for text inputs
//white text for the size of the booth
//center the grid on the artboard
//dynamically be able to change the background of the artboard
//center text and size the text depending on the shape
//cyan 


//Opens the initial dialog. prompts the user to indicate the booth dimensions

var artboardDialog = new Window("dialog", "Booth Blueprint", undefined, {resizeable: false});
artboardDialog.size = [400, 150];
//enter the size of your booth

var artboardGroup = artboardDialog.add("group");
artboardGroup.add("statictext", undefined, "width (ft): ");
var artboardWidthInput = artboardGroup.add("edittext", [0, 0, 50, 20], "");

artboardGroup.add("statictext", undefined, "height (ft): ");
var artboardHeightInput = artboardGroup.add("edittext", [0, 0, 50, 20], "");

// artboardGroup.add("statictext", undefined, "Background")
// var artboardBackground = artboardGroup.add("")

var nextBtn = artboardGroup.add("button", undefined, "Next");
var doc = app.documents.add();
// var doc = app.activeDocument;


var whiteColor = new RGBColor();
whiteColor.red = 255;
whiteColor.green = 255;
whiteColor.blue = 255

//background color
var gradient1 = new CMYKColor();
gradient1.cyan = 89
gradient1.magenta = 61
gradient1.yellow = 0
gradient1.black = 0;

var lineColor = new CMYKColor();
lineColor.cyan = 50;
lineColor.magenta = 0;
lineColor.yellow = 0;
lineColor.black = 0;


//function calculates the margin change so that different sized artboards have the same border margins
function calculateMarginChange(enteredDims) {
  return (43.2 * (enteredDims - 10));
}

function calculateTextChange(enteredDims) {
  return 10 * (enteredDims - 10);
}

function modifyArtboard() {
  var artboardWidth = parseFloat(artboardWidthInput.text);
  var artboardHeight = parseFloat(artboardHeightInput.text);

  var boardWidth = (artboardWidth * 273.6) - calculateMarginChange(artboardWidth);
  var boardHeight = (artboardHeight * 273.6 )- calculateMarginChange(artboardHeight);

  var maxWidth = doc.width; // Canvas width
  var maxHeight = doc.height; // Canvas height


  // Check if the entered dimensions are larger than the canvas size
  if (boardWidth > maxWidth || boardHeight > maxHeight) {
    // Calculate the scale factor to fit within the canvas
    var scaleFactorWidth = Math.min(maxWidth / boardWidth);
    var scaleFactorHeight = Math.min(maxHeight / boardHeight);

    // Scale down the artboard dimensions
    boardWidth *= scaleFactorWidth;
    boardHeight *= scaleFactorHeight;
  }

  var artboardLeft = -boardWidth / 2;
  var artboardTop = boardHeight / 2;
  var artboardRight = boardWidth / 2;
  var artboardBottom = -boardHeight / 2;

 // Update the dimensions of the existing artboard
  doc.artboards[0].artboardRect = [artboardLeft, artboardTop, artboardRight, artboardBottom];

  doc.rulerUnits = RulerUnits.Points;
  doc.colorMode = DocumentColorSpace.RGB;
}


function createArtboard() {
  var artboardWidth = parseFloat(artboardWidthInput.text);
  var artboardHeight = parseFloat(artboardHeightInput.text);

  var boardWidth = (artboardWidth * 273.6) - calculateMarginChange(artboardWidth);
  var boardHeight = artboardHeight * 273.6 - calculateMarginChange(artboardHeight);

  if(artboardWidth > 65 || artboardHeight > 65) {
    modifyArtboard();
  } else {
    var artboardLeft = -boardWidth / 2;
    var artboardTop = boardHeight / 2;
    var artboardRight = boardWidth / 2;
    var artboardBottom = -boardHeight / 2;
  
    // Update the dimensions of the existing artboard
    doc.artboards[0].artboardRect = [artboardLeft, artboardTop, artboardRight, artboardBottom];
  
    doc.rulerUnits = RulerUnits.Points;
    doc.colorMode = DocumentColorSpace.RGB;
  }
}



//This function creates the background based on the user input
function createBackground() {
    var artboardWidth = parseFloat(artboardWidthInput.text);
    var artboardHeight = parseFloat(artboardHeightInput.text);

    //This sets the width and height for the background
    var backgroundWidth = (artboardWidth * 273.6) - calculateMarginChange(artboardWidth);
    var backgroundHeight = (artboardHeight * 273.6) - calculateMarginChange(artboardHeight);

    //this sets the width and height for the grid
    var width = artboardWidth * 230.4;
    var height = artboardHeight * 230.4;

    //adds background to the document path
    var background = doc.pathItems.add();
    background.filled = true;
    background.fillColor = gradient1;

    var x = -backgroundWidth / 2;
    var y = backgroundHeight / 2;
    var bgWidth = backgroundWidth;
    var bgHeight = -backgroundHeight ; 

    background.setEntirePath([[x,y], [x + bgWidth, y], [x + bgWidth, y + bgHeight], [x, y + bgHeight]])

    //call the createGrid within the background function to create the grid at the same time
    createGrid(width, height);

    var textFrame = doc.textFrames.add();
    textFrame.contents =   artboardWidth + "ft" + " X "  + artboardHeight + "ft"
    textFrame.textRange.characterAttributes.fillColor = whiteColor; // Set text color to black
    var textFont = app.textFonts.getByName("MyriadPro-Bold");
    textFrame.textRange.characterAttributes.textFont = textFont;
    textFrame.textRange.characterAttributes.size = 130; 

    
    textFrame.position = [x, y - 25];
    textFrame.height = 150;
    textFrame.textRange.paragraphAttributes.leftIndent = 50;   // Adjust left margin

}


//This function creates the grid setting the spacing and grid line styling
function createGrid (width, height) {
    var spacing = 220;

    var gridlineGroup = doc.groupItems.add(); // Create a group for the grid lines
    gridlineGroup.name = "gridlineGroup";

    var offsetFactor = 46;

  
    //This loops through creating horizontal lines 
    for (var y = -height / 2; y <= height / 2.15; y += spacing) {
        var line = doc.pathItems.add();
        line.stroked = true;
        line.strokeColor = lineColor;
        line.strokeWidth = 1.5; 
        var x1 = (-width / 2) - (width / offsetFactor ); 

        var x2 = (width / 2 ) - (width / offsetFactor);  


        line.setEntirePath([[x1, y], [x2, y]]);

        line.move(gridlineGroup, ElementPlacement.PLACEATBEGINNING); 
    }

    //This loop creates the vertical lines for the grid
    for (var x = -width / 2 ; x <= width / 2.15; x += spacing) {
        var line = doc.pathItems.add();
        line.stroked = true;
      
        line.strokeColor = lineColor;
        line.strokeWidth = 1.5; 
        var y1 = -height / 2 - (height / offsetFactor);
        var y2 = height / 2 - (height / offsetFactor);

        line.setEntirePath([[x, y1], [x, y2]]);

        line.move(gridlineGroup, ElementPlacement.PLACEATBEGINNING); 

    }

    var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    var centerX = (artboard.artboardRect[2] + artboard.artboardRect[0]) / 2;
    var centerY = (artboard.artboardRect[3] + artboard.artboardRect[1]) / 2;
    
    var groupBounds = gridlineGroup.geometricBounds;
    var groupCenterX = (groupBounds[2] + groupBounds[0]) / 2;
    var groupCenterY = (groupBounds[3] + groupBounds[1]) / 2;
    
    var deltaX = centerX - groupCenterX;
    var deltaY = centerY - groupCenterY;
    
    gridlineGroup.left += deltaX;
    gridlineGroup.top += deltaY;

    gridlineGroup.locked = true;
    

}


////////////////////////////////////////////////////////////
//the following is pretty much the same as the original to create the shapes and text
// Step 1: Set up the User Interface for the first pop-up
var dialog1 = new Window("dialog", "Shape Creator", undefined, { resizeable: false });
dialog1.size = [400, 150];
// dialog1.orientation = "column";

var dimensionGroup = dialog1.add("group");
dimensionGroup.add("statictext", undefined, "Width (inches):");
var widthInput = dimensionGroup.add("edittext", [0, 0, 50, 20], ""); // Adjust the preferredSize here

dimensionGroup.add("statictext", undefined, "Depth (inches):");
var heightInput = dimensionGroup.add("edittext", [0, 0, 50, 20], ""); // Adjust the preferredSize here

var shapeButtonGroup = dialog1.add("group");
var circleButton = shapeButtonGroup.add("radiobutton", undefined, "Circle");
var squareButton = shapeButtonGroup.add("radiobutton", undefined, "Square");


var nextButton = dialog1.add("button", undefined, "Next");
nextButton.enabled = false; // Disable Next button initially

/////////////////////////////////////////////////////////////////////////////

// Step 2: Update Next button state based on input
widthInput.onChange = heightInput.onChange = function() {
  var widthValue = parseFloat(widthInput.text);
  var heightValue = parseFloat(heightInput.text);

  if (isNaN(widthValue) || isNaN(heightValue) || widthValue <= 0 || heightValue <= 0) {
    nextButton.enabled = false; // Disable Next button if input is invalid
  } else {
    nextButton.enabled = true; // Enable Next button if input is valid
  }
};

/////////////////////////////////////////////////////////////////////////////

// Step 3: Retrieve User Input from the first pop-up
nextButton.onClick = function() {
    var width = parseFloat(widthInput.text) * 72; // Convert inches to points
    var height = parseFloat(heightInput.text) * 72; // Convert inches to points
    var isCircle = circleButton.value;
  
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      // Step 4: Create the Shape based on User Input
      var shape;
      if (isCircle) {
        shape = app.activeDocument.activeLayer.pathItems.ellipse(0, 0, width, height);
      } else {
        shape = app.activeDocument.activeLayer.pathItems.rectangle(0, 0, width, height);
      }
  
      shape.filled = false;
      shape.stroked = true;
      shape.strokeWidth = 65;
      shape.strokeColor = new CMYKColor(0, 0, 0, 50);
  
      // Reduce the size of the shape by 75%
      var scaleRatio = 0.25; // 1/4th scale
      shape.resize(scaleRatio * 100, scaleRatio * 100, true, true, true, true, scaleRatio * 100);
  
      dialog1.close();
      showDialog2(shape);
    }
  };
  
/////////////////////////////////////////////////////////////////////////////

// Step 5: Set up the User Interface for the second pop-up
function showDialog2(shape) {
  var dialog2 = new Window("dialog", "Text Input", undefined, { resizeable: false });
  dialog2.size = [300, 125];
  dialog2.orientation = "column";

  var textGroup = dialog2.add("group");
  textGroup.add("statictext", undefined, "Enter Text:");
  var textInput = textGroup.add("edittext", undefined, "", {
    multiline: true,
    scrolling: true,
    enterKeySignalsOnChange: false
  });
  textInput.minimumSize.width = 200;
  textInput.minimumSize.height = 50;

  var generateButton = dialog2.add("button", undefined, "Generate");

  // Step 6: Retrieve User Input from the second pop-up
  generateButton.onClick = function() {
    var textContent = textInput.text;



// Step 7: Generate Text on the Artboard within the Shape
var textFrame = app.activeDocument.activeLayer.textFrames.add();
textFrame.contents = textContent;
textFrame.textRange.characterAttributes.fillColor = new CMYKColor(0, 0, 0, 75);

// Get the bounds of the shape and text frame
var shapeBounds = shape.geometricBounds;
var textBounds = textFrame.geometricBounds;

// Calculate the scale factor for text enlargement
var scaleFactor = Math.min((shapeBounds[2] - shapeBounds[0]) / textBounds[2], (shapeBounds[3] - shapeBounds[1]) / textBounds[3]);

// Enlarge the text frame to fill the shape
textFrame.resize(scaleFactor * 80, scaleFactor * 80, true, true, true, true, scaleFactor * 80);

// Calculate the new bounds of the enlarged text frame
textBounds = textFrame.geometricBounds;

// Calculate the offset for horizontal and vertical alignment
var xOffset = (shapeBounds[2] - shapeBounds[0] - textBounds[2] + textBounds[0]) / 2;
var yOffset = (shapeBounds[3] - shapeBounds[1] - textBounds[3] + textBounds[1]) / 2;

// Move the text frame to align it with the shape
textFrame.top = (shape.top + yOffset);
textFrame.left =(shape.left + xOffset);

var widthValue = parseFloat(widthInput.text);
var heightValue = parseFloat(heightInput.text);

if(heightValue <= 5) {
  textFrame.top = (shape.top + yOffset) + 75;
  textFrame.left =(shape.left + xOffset);
  var initialSize = 50; 
  textFrame.textRange.characterAttributes.size = initialSize;
  var newSize = initialSize * 2; 
  textFrame.textRange.characterAttributes.size = newSize; 
}

if (widthValue <= 5) {
  textFrame.top = (shape.top + yOffset) - 100;
  textFrame.left =(shape.left + xOffset) - 50;
  textFrame.rotate(90);
  var initialSize = 50; 
  textFrame.textRange.characterAttributes.size = initialSize;

  // Increase the text size
  var newSize = initialSize * 2; // Replace 1.5 with the factor by which you want to increase the size
  textFrame.textRange.characterAttributes.size = newSize; 
}


/////////////////////////////////////////////////////////////////////////////

// Step 8: Group the Text with the Shape and center on the artboard
var groupItems = app.activeDocument.activeLayer.groupItems;
var group = groupItems.add();
group.name = "Shape with Text";
shape.move(group, ElementPlacement.PLACEATEND);
textFrame.move(group, ElementPlacement.PLACEATEND);

// Get the bounds of the artboard and the group
var artboard = app.activeDocument.artboards[0];
var artboardBounds = artboard.artboardRect;
var groupBounds = group.geometricBounds;

// Calculate the center of the artboard and the center of the group
var artboardCenterX = (artboardBounds[0] + artboardBounds[2]) / 2;
var artboardCenterY = (artboardBounds[1] + artboardBounds[3]) / 2;
var groupCenterX = (groupBounds[0] + groupBounds[2]) / 2;
var groupCenterY = (groupBounds[1] + groupBounds[3]) / 2;

// Calculate the translation needed to center the group on the artboard
var xOffset = artboardCenterX - groupCenterX;
var yOffset = artboardCenterY - groupCenterY;

// Move the group to the center of the artboard
group.translate(xOffset, yOffset);

dialog2.close();


  };

  dialog2.show();
}
  
///////////////////////////////////////////////////////////


nextBtn.onClick = function() {
    artboardDialog.close();
    createArtboard();
    createBackground();
    dialog1.show();
}


artboardDialog.show();
