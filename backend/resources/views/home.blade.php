<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        th,td{
            margin:4px;
             border: 2px solid black;
             padding: 6px;
        }

        table{
            border: 2px solid black;
        }
    </style>
</head>
<body>
    <h1>This is <a href="{{ route('jk') }}">homepage</a> </h1>

    <table>
        <tr>
            <th>No.</th>
      
            <th>Name</th>
       
            <th>Email</th>
        </tr>
       <?php 
//  print_r($users);exit;
       foreach($users as $user){
        ?>
         <tr>
            <td> {{$user['id'] }} </td>
      
            <td> {{$user['name']}} </td>
       
            <td> {{$user['email']}} </td>
        </tr>
        <?php 
       }
       
       ?>
    </table>
</body>
</html>