
        $(document).ready(function() {
            $.get('datatu.php', function(data) {
                console.log(data); // Debugging: Check the received data
                const sessionData = JSON.parse(data);
    
                if (sessionData.isSuccess) {
                    $('#lname').text(sessionData.lastName || 'N/A');
                    $('#mname').text(sessionData.middleName || 'N/A');
                    $('#fname').text(sessionData.firstName || 'N/A');
                    $('#bday').text(sessionData.birthdate || 'N/A');
                    $('#age').text(sessionData.age || 'N/A');
                    $('#gender').text(sessionData.gender || 'N/A');
                    $('#connum').text(sessionData.contactNumber || 'N/A');
                    $('#email').text(sessionData.email || 'N/A');
                    $('#insti').text(sessionData.institution || 'N/A');
                    $('#student').text(sessionData.studentID || 'N/A');
                    $('#province').text(sessionData.province || 'N/A');
                    $('#city').text(sessionData.city || 'N/A');
                    $('#barangay').text(sessionData.barangay || 'N/A');
                    $('#blk').text(sessionData.blkLot || 'N/A');
                } else {
                    console.error(sessionData.msg);
                    alert(sessionData.msg);
                }
            }).fail(function() {
                console.error("Error fetching data.");
            });
        });
