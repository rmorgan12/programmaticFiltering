//Available globals
var domo = window.domo;
var datasets = window.datasets;
var currentUser = domo.env.userId
console.log("User ID:", currentUser)
var filterlist = []
var userGroup = []



domo.get(`/domo/groups/v1/user/${domo.env.userId}`)
    .then(handlesGroups)


function handlesGroups(data) {
    for (const group of data) {
    		userGroup.push(group.id);
    }
}


var fields = ['GroupName', 'FilterColumn', 'FilterValue', 'FilterOperator', 'FilterDatatype', 'GroupID'];
var query = `/data/v1/${datasets[0]}?fields=${fields.join()}`;
domo.get(query).then(handleResult);



//Step 3. Do something with the data from the query result
function handleResult(data){
  console && console.log(data);

function createFilterListContainer(groupID) {
    const matchingGroups = data.filter(item => item.GroupID === groupID);

    if (matchingGroups.length > 0) {
        filterlist = matchingGroups.map(matchingGroup => ({
            column: matchingGroup.FilterColumn,
            operator: matchingGroup.FilterOperator,
            values: [matchingGroup.FilterValue],
            dataType: matchingGroup.FilterDatatype
        }));

        console.log('filterlist:', filterlist);
        // You can use the filterlist array as needed (e.g., pass it to another function, use it in your application, etc.)
    } else {
        console.log(`No matching GroupID found: ${groupID}`);
    }
}



	const applyFilters = () => {
 	 	console.log('Applying filters to Page')
 		console.log(filterlist)
 		domo.filterContainer(filterlist)
 		console.log('Filters applied')
		}

  // Default first but can ask for defuatt behavior 
  
		createFilterListContainer(userGroup[0]);
		applyFilters()
}

