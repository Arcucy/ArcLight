<template>
  <div>
    <div class="landing-container">
      <Header />
      <aplayer v-if="audio !== ''" :audio="audio" :lrcType="0" class="player"/>
      <div id='stars'></div>
      <div id='stars2'></div>
      <div id='stars3'></div>
      <div id='horizon'>
          <div class='glow'></div>
      </div>
      <div id='earth'></div>
      <div id='title'>
          ArcLight
      </div>
      <div id='subtitle'>
          <span>
              Store
          </span>
          <span>
              In
          </span>
          <span>
              Permaweb
          </span>
      </div>
      <div class="notice">Developed by <a href="https://github.com/nekomeowww">Ayaka Neko</a> for Project <a href="https://github.com/AyakaLab/ArcLight">ArcLight</a></div>
    </div>
  </div>
</template>

<script>

import flac from '@/assets/Music/FlowerDance.flac'
import album from '@/assets/Music/FlowerDance.jpg'

import Header from '@/components/Header.vue'

export default {
  components: {
    Header
  },
  data () {
    return {
      musicId: '',
      audio: '',
      audioList: {
        flowerdance: {
          name: 'Flower Dance',
          artist: 'DJ OKAWARI',
          url: flac,
          cover: album
        }
      }
    }
  },
  watch: {
    $route (val) {
      if (this.audioList[val.params.id] !== undefined || this.audioList[val.params.id] !== '') this.audio = this.audioList[val.params.id]
    }
  },
  mounted () {
    if (this.audioList[this.$route.params.id] !== undefined || this.audioList[this.$route.params.id] !== '') this.audio = this.audioList[this.$route.params.id]
    else this.$router.push({ name: 'Landing' })
  }
}
</script>

<style lang="less" scoped>

.player {
  width: 30%;
  margin: 0 auto;
  margin-top: 20rem;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease;
  animation-duration: 3s;
}

/deep/ .aplayer-title {
  color: #000;
}

#stars {
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: 1444px 800px #FFF, 1697px 1509px #FFF, 1843px 850px #FFF, 1164px 1125px #FFF, 841px 1399px #FFF, 1602px 469px #FFF, 1940px 39px #FFF, 1966px 1306px #FFF, 1336px 181px #FFF, 1483px 749px #FFF, 201px 1663px #FFF, 1919px 262px #FFF, 294px 646px #FFF, 673px 1202px #FFF, 1951px 832px #FFF, 122px 1248px #FFF, 611px 20px #FFF, 9px 1515px #FFF, 1886px 701px #FFF, 1614px 1752px #FFF, 1730px 371px #FFF, 1930px 1663px #FFF, 1317px 1595px #FFF, 1662px 102px #FFF, 1645px 797px #FFF, 1379px 100px #FFF, 1748px 584px #FFF, 1341px 377px #FFF, 249px 1127px #FFF, 318px 1826px #FFF, 309px 1503px #FFF, 1426px 38px #FFF, 876px 1395px #FFF, 1731px 617px #FFF, 341px 1912px #FFF, 1308px 1458px #FFF, 1102px 941px #FFF, 1819px 8px #FFF, 74px 1797px #FFF, 1949px 402px #FFF, 592px 197px #FFF, 600px 1021px #FFF, 595px 1482px #FFF, 243px 272px #FFF, 933px 320px #FFF, 867px 1018px #FFF, 201px 182px #FFF, 295px 325px #FFF, 1705px 1042px #FFF, 33px 1861px #FFF, 436px 1413px #FFF, 1061px 22px #FFF, 1027px 1194px #FFF, 876px 763px #FFF, 439px 707px #FFF, 208px 1004px #FFF, 307px 1186px #FFF, 323px 912px #FFF, 1342px 543px #FFF, 1972px 776px #FFF, 1743px 689px #FFF, 1965px 1955px #FFF, 511px 1187px #FFF, 1073px 674px #FFF, 733px 734px #FFF, 169px 947px #FFF, 743px 903px #FFF, 517px 503px #FFF, 712px 258px #FFF, 666px 1226px #FFF, 1457px 1914px #FFF, 1735px 871px #FFF, 137px 1456px #FFF, 470px 151px #FFF, 281px 714px #FFF, 1366px 599px #FFF, 1823px 150px #FFF, 131px 337px #FFF, 1007px 1258px #FFF, 1550px 641px #FFF, 833px 1512px #FFF, 1936px 305px #FFF, 1305px 422px #FFF, 1485px 917px #FFF, 1469px 184px #FFF, 207px 580px #FFF, 848px 1859px #FFF, 157px 745px #FFF, 1716px 1820px #FFF, 653px 1809px #FFF, 131px 28px #FFF, 761px 1198px #FFF, 1693px 1231px #FFF, 1513px 806px #FFF, 1184px 1072px #FFF, 1641px 1484px #FFF, 1653px 91px #FFF, 1609px 1210px #FFF, 1436px 1127px #FFF, 1869px 712px #FFF, 206px 1826px #FFF, 166px 160px #FFF, 445px 1703px #FFF, 686px 1960px #FFF, 1101px 254px #FFF, 1196px 1348px #FFF, 55px 1630px #FFF, 49px 503px #FFF, 1004px 1200px #FFF, 525px 1747px #FFF, 1440px 387px #FFF, 1618px 824px #FFF, 556px 626px #FFF, 1324px 165px #FFF, 1545px 746px #FFF, 923px 987px #FFF, 394px 649px #FFF, 1375px 1638px #FFF, 1540px 62px #FFF, 6px 103px #FFF, 836px 1780px #FFF, 1421px 1110px #FFF, 284px 1361px #FFF, 457px 185px #FFF, 985px 1883px #FFF, 1972px 1966px #FFF, 276px 1970px #FFF, 1670px 297px #FFF, 730px 287px #FFF, 1887px 1849px #FFF, 1635px 315px #FFF, 1430px 992px #FFF, 884px 984px #FFF, 1495px 612px #FFF, 1750px 629px #FFF, 1337px 763px #FFF, 1657px 1011px #FFF, 1015px 413px #FFF, 470px 103px #FFF, 408px 294px #FFF, 942px 1533px #FFF, 802px 1887px #FFF, 134px 756px #FFF, 1319px 1040px #FFF, 1522px 1026px #FFF, 153px 8px #FFF, 897px 1620px #FFF, 1745px 789px #FFF, 741px 1827px #FFF, 634px 1596px #FFF, 1366px 1399px #FFF, 1980px 1814px #FFF, 1859px 1254px #FFF, 1346px 1618px #FFF, 1339px 1292px #FFF, 1493px 1087px #FFF, 1005px 1241px #FFF, 425px 1823px #FFF, 50px 37px #FFF, 93px 1439px #FFF, 742px 1146px #FFF, 1769px 1129px #FFF, 832px 1997px #FFF, 1328px 654px #FFF, 841px 355px #FFF, 1885px 482px #FFF, 1493px 893px #FFF, 867px 1073px #FFF, 1908px 565px #FFF, 1164px 1017px #FFF, 457px 1956px #FFF, 1902px 1694px #FFF, 595px 488px #FFF, 1460px 1178px #FFF, 917px 1143px #FFF, 1386px 317px #FFF, 1266px 1902px #FFF, 1101px 1869px #FFF, 10px 1015px #FFF, 1930px 756px #FFF, 622px 1220px #FFF, 261px 333px #FFF, 534px 1926px #FFF, 1202px 768px #FFF, 1891px 364px #FFF, 429px 1129px #FFF, 1114px 632px #FFF, 138px 1238px #FFF, 535px 822px #FFF, 1505px 370px #FFF, 846px 962px #FFF, 720px 28px #FFF, 1078px 1282px #FFF, 667px 829px #FFF, 1052px 1903px #FFF, 124px 732px #FFF, 1774px 1684px #FFF, 1046px 867px #FFF, 1803px 595px #FFF, 509px 1408px #FFF, 1006px 188px #FFF, 1793px 1612px #FFF, 215px 340px #FFF, 1785px 879px #FFF, 1986px 416px #FFF, 840px 1585px #FFF, 1182px 811px #FFF, 120px 998px #FFF, 1337px 1106px #FFF, 781px 640px #FFF, 716px 569px #FFF, 1359px 403px #FFF, 575px 503px #FFF, 935px 648px #FFF, 335px 952px #FFF, 1669px 9px #FFF, 643px 188px #FFF, 1210px 1629px #FFF, 1435px 1324px #FFF, 1504px 290px #FFF, 1802px 1772px #FFF, 1538px 1376px #FFF, 1371px 1310px #FFF, 1603px 1997px #FFF, 694px 644px #FFF, 342px 1125px #FFF, 1155px 864px #FFF, 449px 500px #FFF, 1604px 836px #FFF, 1248px 1736px #FFF, 1847px 896px #FFF, 1203px 755px #FFF, 1553px 587px #FFF, 715px 1771px #FFF, 746px 324px #FFF, 1679px 1595px #FFF, 1115px 56px #FFF, 1116px 1295px #FFF, 243px 437px #FFF, 999px 876px #FFF, 1772px 1577px #FFF, 1448px 387px #FFF, 1213px 1371px #FFF, 236px 251px #FFF, 1582px 428px #FFF, 848px 1489px #FFF, 961px 1423px #FFF, 1897px 1008px #FFF, 920px 1345px #FFF, 1996px 505px #FFF, 1117px 1839px #FFF, 61px 1673px #FFF, 815px 1079px #FFF, 922px 654px #FFF, 858px 1543px #FFF, 700px 1341px #FFF, 292px 641px #FFF, 760px 396px #FFF, 1946px 112px #FFF, 731px 506px #FFF, 266px 1632px #FFF, 1142px 1237px #FFF, 589px 1843px #FFF, 1515px 1488px #FFF, 659px 980px #FFF, 1881px 1365px #FFF, 701px 395px #FFF, 1291px 530px #FFF, 1273px 1711px #FFF, 1044px 483px #FFF, 1147px 1287px #FFF, 1252px 650px #FFF, 313px 458px #FFF, 906px 485px #FFF, 1813px 984px #FFF, 338px 83px #FFF, 257px 190px #FFF, 934px 1487px #FFF, 1983px 1612px #FFF, 115px 1006px #FFF, 921px 1475px #FFF, 477px 395px #FFF, 662px 894px #FFF, 1190px 1476px #FFF, 1157px 1276px #FFF, 1387px 1254px #FFF, 1455px 380px #FFF, 63px 921px #FFF, 1817px 1886px #FFF, 1903px 699px #FFF, 640px 1064px #FFF, 1726px 750px #FFF, 336px 1575px #FFF, 1727px 250px #FFF, 1897px 1612px #FFF, 467px 1351px #FFF, 781px 1463px #FFF, 859px 369px #FFF, 194px 408px #FFF, 784px 1125px #FFF, 1460px 1614px #FFF, 1433px 1673px #FFF, 1427px 1144px #FFF, 952px 93px #FFF, 1855px 187px #FFF, 1749px 1236px #FFF, 1992px 737px #FFF, 606px 1901px #FFF, 318px 1558px #FFF, 207px 1683px #FFF, 1845px 474px #FFF, 1428px 154px #FFF, 835px 59px #FFF, 553px 701px #FFF, 1670px 159px #FFF, 246px 1268px #FFF, 1527px 1718px #FFF, 552px 146px #FFF, 134px 862px #FFF, 35px 1549px #FFF, 1312px 1359px #FFF, 1469px 1837px #FFF, 973px 51px #FFF, 521px 1435px #FFF, 1450px 504px #FFF, 1426px 591px #FFF, 1076px 70px #FFF, 904px 289px #FFF, 298px 1106px #FFF, 270px 1442px #FFF, 1278px 641px #FFF, 1356px 1851px #FFF, 638px 1811px #FFF, 1969px 1024px #FFF, 330px 761px #FFF, 537px 1367px #FFF, 1323px 567px #FFF, 1948px 1023px #FFF, 789px 1680px #FFF, 1921px 766px #FFF, 1121px 1539px #FFF, 571px 66px #FFF, 1308px 709px #FFF, 426px 785px #FFF, 1030px 1858px #FFF, 1194px 506px #FFF, 913px 544px #FFF, 853px 842px #FFF, 721px 1088px #FFF, 753px 1476px #FFF, 1831px 377px #FFF, 1937px 349px #FFF, 1250px 1069px #FFF, 27px 1164px #FFF, 338px 1187px #FFF, 1845px 1416px #FFF, 1640px 1984px #FFF, 278px 783px #FFF, 1315px 147px #FFF, 1546px 1548px #FFF, 419px 1790px #FFF, 1670px 964px #FFF, 1930px 1638px #FFF, 584px 1684px #FFF, 1916px 774px #FFF, 1454px 1892px #FFF, 1170px 1670px #FFF, 1833px 1698px #FFF, 1223px 1985px #FFF, 492px 1620px #FFF, 529px 1330px #FFF, 1678px 945px #FFF, 1523px 1926px #FFF, 1662px 467px #FFF, 479px 1105px #FFF, 98px 831px #FFF, 237px 128px #FFF, 1744px 690px #FFF, 1475px 808px #FFF, 500px 1613px #FFF, 1441px 573px #FFF, 1148px 1083px #FFF, 1262px 1255px #FFF, 345px 1329px #FFF, 798px 1519px #FFF, 370px 440px #FFF, 1909px 1279px #FFF, 187px 1805px #FFF, 178px 512px #FFF, 1365px 738px #FFF, 1344px 1650px #FFF, 881px 845px #FFF, 584px 510px #FFF, 695px 415px #FFF, 132px 1564px #FFF, 370px 753px #FFF, 657px 1927px #FFF, 768px 702px #FFF, 611px 335px #FFF, 1900px 1316px #FFF, 684px 382px #FFF, 1048px 1592px #FFF, 39px 492px #FFF, 1932px 1407px #FFF, 1707px 354px #FFF, 683px 851px #FFF, 1506px 510px #FFF, 1851px 1601px #FFF, 1705px 861px #FFF, 993px 1327px #FFF, 1116px 1064px #FFF, 1799px 1064px #FFF, 1030px 75px #FFF, 866px 1860px #FFF, 101px 1456px #FFF, 1231px 330px #FFF, 5px 1768px #FFF, 356px 1485px #FFF, 826px 1244px #FFF, 1813px 578px #FFF, 520px 1119px #FFF, 167px 1346px #FFF, 1694px 1907px #FFF, 1734px 1940px #FFF, 68px 1272px #FFF, 1992px 1646px #FFF, 1844px 1522px #FFF, 1099px 602px #FFF, 757px 1825px #FFF, 1344px 262px #FFF, 1705px 1791px #FFF, 411px 731px #FFF, 1039px 1584px #FFF, 790px 103px #FFF, 1950px 1027px #FFF, 1375px 1567px #FFF, 1933px 520px #FFF, 470px 1414px #FFF, 1007px 1142px #FFF, 340px 1005px #FFF, 1014px 670px #FFF, 830px 906px #FFF, 758px 382px #FFF, 832px 781px #FFF, 670px 622px #FFF, 1792px 298px #FFF, 702px 1278px #FFF, 1316px 867px #FFF, 408px 1846px #FFF, 206px 541px #FFF, 622px 1211px #FFF, 492px 359px #FFF, 1374px 1754px #FFF, 1576px 339px #FFF, 509px 1414px #FFF, 285px 769px #FFF, 1781px 52px #FFF, 1024px 302px #FFF, 104px 1740px #FFF, 605px 1284px #FFF, 119px 381px #FFF, 217px 1147px #FFF, 726px 618px #FFF, 1294px 169px #FFF, 1348px 1690px #FFF, 1456px 1640px #FFF, 1072px 514px #FFF, 225px 1160px #FFF, 592px 1130px #FFF, 521px 1925px #FFF, 762px 1369px #FFF, 1509px 1483px #FFF, 1550px 431px #FFF, 1007px 650px #FFF, 1627px 779px #FFF, 867px 498px #FFF, 1304px 1417px #FFF, 371px 1780px #FFF, 664px 494px #FFF, 1126px 431px #FFF, 1413px 194px #FFF, 961px 115px #FFF, 739px 1775px #FFF, 1387px 1153px #FFF, 990px 1845px #FFF, 941px 1577px #FFF, 1609px 880px #FFF, 1045px 1677px #FFF, 1698px 1649px #FFF, 641px 1475px #FFF, 1666px 87px #FFF, 751px 1760px #FFF, 1772px 112px #FFF, 480px 1844px #FFF, 528px 1816px #FFF, 1989px 1079px #FFF, 1690px 11px #FFF, 786px 1089px #FFF, 324px 766px #FFF, 1774px 687px #FFF, 17px 421px #FFF, 1327px 1416px #FFF, 972px 1112px #FFF, 1081px 1185px #FFF, 1929px 1051px #FFF, 886px 773px #FFF, 51px 1973px #FFF, 842px 1647px #FFF, 1584px 1495px #FFF, 507px 432px #FFF, 308px 166px #FFF, 1375px 194px #FFF, 606px 883px #FFF, 1991px 837px #FFF, 1728px 98px #FFF, 1195px 1331px #FFF, 1713px 1454px #FFF, 1877px 281px #FFF, 612px 702px #FFF, 686px 1886px #FFF, 528px 723px #FFF, 1191px 1220px #FFF, 610px 29px #FFF, 1920px 459px #FFF, 660px 808px #FFF, 1149px 1561px #FFF, 11px 1804px #FFF, 502px 779px #FFF, 333px 1024px #FFF, 1465px 1367px #FFF, 264px 1925px #FFF, 1650px 1408px #FFF, 1290px 1471px #FFF, 1315px 515px #FFF, 986px 1094px #FFF, 1121px 979px #FFF, 229px 1573px #FFF, 561px 1366px #FFF, 1143px 568px #FFF, 777px 89px #FFF, 582px 1015px #FFF, 800px 1208px #FFF, 300px 1529px #FFF, 4px 1582px #FFF, 98px 1437px #FFF, 1789px 2px #FFF, 1718px 901px #FFF, 1323px 1842px #FFF, 1192px 1601px #FFF, 1863px 1635px #FFF, 130px 311px #FFF, 1px 664px #FFF, 164px 1210px #FFF, 1808px 277px #FFF, 409px 1849px #FFF, 963px 1236px #FFF, 1147px 1418px #FFF, 56px 1715px #FFF, 102px 1921px #FFF, 925px 1565px #FFF, 1929px 1667px #FFF, 1392px 147px #FFF, 1225px 929px #FFF, 1165px 872px #FFF, 1416px 1167px #FFF, 1700px 1816px #FFF, 900px 71px #FFF, 1684px 859px #FFF, 19px 142px #FFF, 1104px 222px #FFF, 1180px 515px #FFF, 1584px 1123px #FFF, 1158px 1618px #FFF, 305px 1719px #FFF, 1170px 28px #FFF, 1469px 1577px #FFF, 1893px 619px #FFF, 1820px 1328px #FFF, 1320px 1737px #FFF, 1852px 887px #FFF, 71px 305px #FFF, 634px 1723px #FFF, 1087px 141px #FFF, 837px 190px #FFF, 882px 739px #FFF, 370px 1393px #FFF, 102px 1116px #FFF, 597px 547px #FFF, 1275px 1813px #FFF, 1828px 1032px #FFF, 16px 1200px #FFF, 922px 1310px #FFF, 679px 1787px #FFF, 1365px 381px #FFF, 292px 286px #FFF, 761px 1772px #FFF, 967px 1502px #FFF, 591px 380px #FFF, 1638px 801px #FFF, 1646px 1807px #FFF, 626px 990px #FFF, 750px 1264px #FFF, 1049px 296px #FFF, 473px 387px #FFF, 214px 1845px #FFF, 523px 585px #FFF, 1573px 1801px #FFF, 65px 699px #FFF, 1656px 793px #FFF, 546px 262px #FFF, 1723px 262px #FFF, 445px 626px #FFF, 1761px 1436px #FFF, 673px 1301px #FFF, 615px 532px #FFF, 1889px 1755px #FFF, 1552px 1549px #FFF, 1692px 832px #FFF, 1808px 1249px #FFF, 615px 991px #FFF, 1048px 826px #FFF, 711px 472px #FFF, 558px 992px #FFF, 668px 638px #FFF, 865px 1561px #FFF, 869px 1193px #FFF, 274px 1816px #FFF, 247px 1315px #FFF, 56px 1076px #FFF, 1988px 1598px #FFF, 224px 1551px #FFF, 1540px 1819px #FFF, 396px 937px #FFF, 1623px 1612px #FFF, 1432px 686px #FFF, 676px 1398px #FFF, 85px 1142px #FFF, 1309px 509px #FFF, 1227px 493px #FFF, 1907px 1867px #FFF, 1117px 949px #FFF, 992px 1977px #FFF, 387px 1613px #FFF, 1290px 860px #FFF, 651px 273px #FFF, 610px 132px #FFF, 1061px 106px #FFF, 925px 852px #FFF, 1419px 1674px #FFF, 154px 1398px #FFF, 1249px 317px #FFF, 788px 1214px #FFF, 1691px 724px #FFF, 559px 1532px #FFF, 933px 1057px #FFF, 660px 1608px #FFF, 1220px 1942px #FFF, 468px 1899px #FFF, 1003px 1071px #FFF, 908px 1287px #FFF, 854px 1210px #FFF, 1839px 1105px #FFF, 1000px 1427px #FFF, 307px 686px #FFF, 861px 1508px #FFF, 119px 655px #FFF, 547px 1088px #FFF, 1650px 108px #FFF, 447px 1727px #FFF, 320px 1157px #FFF, 1678px 813px #FFF, 1252px 1324px #FFF, 490px 982px #FFF, 1415px 449px #FFF, 1003px 779px #FFF, 1188px 1680px #FFF, 381px 375px #FFF, 192px 485px #FFF, 1093px 1714px #FFF, 1806px 1365px #FFF, 1500px 1491px #FFF, 1966px 388px #FFF, 1216px 541px #FFF, 1769px 849px #FFF, 230px 522px #FFF, 114px 662px #FFF, 244px 1984px #FFF, 105px 1462px #FFF, 1272px 286px #FFF, 1563px 1622px #FFF, 294px 1769px #FFF, 41px 350px #FFF, 1300px 1126px #FFF, 211px 495px #FFF, 1258px 1459px #FFF, 404px 1248px #FFF, 421px 1535px #FFF, 284px 1345px #FFF, 758px 1242px #FFF, 1467px 1080px #FFF;
    animation: animStar 50s linear infinite;
}

#stars:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: 1444px 800px #FFF, 1697px 1509px #FFF, 1843px 850px #FFF, 1164px 1125px #FFF, 841px 1399px #FFF, 1602px 469px #FFF, 1940px 39px #FFF, 1966px 1306px #FFF, 1336px 181px #FFF, 1483px 749px #FFF, 201px 1663px #FFF, 1919px 262px #FFF, 294px 646px #FFF, 673px 1202px #FFF, 1951px 832px #FFF, 122px 1248px #FFF, 611px 20px #FFF, 9px 1515px #FFF, 1886px 701px #FFF, 1614px 1752px #FFF, 1730px 371px #FFF, 1930px 1663px #FFF, 1317px 1595px #FFF, 1662px 102px #FFF, 1645px 797px #FFF, 1379px 100px #FFF, 1748px 584px #FFF, 1341px 377px #FFF, 249px 1127px #FFF, 318px 1826px #FFF, 309px 1503px #FFF, 1426px 38px #FFF, 876px 1395px #FFF, 1731px 617px #FFF, 341px 1912px #FFF, 1308px 1458px #FFF, 1102px 941px #FFF, 1819px 8px #FFF, 74px 1797px #FFF, 1949px 402px #FFF, 592px 197px #FFF, 600px 1021px #FFF, 595px 1482px #FFF, 243px 272px #FFF, 933px 320px #FFF, 867px 1018px #FFF, 201px 182px #FFF, 295px 325px #FFF, 1705px 1042px #FFF, 33px 1861px #FFF, 436px 1413px #FFF, 1061px 22px #FFF, 1027px 1194px #FFF, 876px 763px #FFF, 439px 707px #FFF, 208px 1004px #FFF, 307px 1186px #FFF, 323px 912px #FFF, 1342px 543px #FFF, 1972px 776px #FFF, 1743px 689px #FFF, 1965px 1955px #FFF, 511px 1187px #FFF, 1073px 674px #FFF, 733px 734px #FFF, 169px 947px #FFF, 743px 903px #FFF, 517px 503px #FFF, 712px 258px #FFF, 666px 1226px #FFF, 1457px 1914px #FFF, 1735px 871px #FFF, 137px 1456px #FFF, 470px 151px #FFF, 281px 714px #FFF, 1366px 599px #FFF, 1823px 150px #FFF, 131px 337px #FFF, 1007px 1258px #FFF, 1550px 641px #FFF, 833px 1512px #FFF, 1936px 305px #FFF, 1305px 422px #FFF, 1485px 917px #FFF, 1469px 184px #FFF, 207px 580px #FFF, 848px 1859px #FFF, 157px 745px #FFF, 1716px 1820px #FFF, 653px 1809px #FFF, 131px 28px #FFF, 761px 1198px #FFF, 1693px 1231px #FFF, 1513px 806px #FFF, 1184px 1072px #FFF, 1641px 1484px #FFF, 1653px 91px #FFF, 1609px 1210px #FFF, 1436px 1127px #FFF, 1869px 712px #FFF, 206px 1826px #FFF, 166px 160px #FFF, 445px 1703px #FFF, 686px 1960px #FFF, 1101px 254px #FFF, 1196px 1348px #FFF, 55px 1630px #FFF, 49px 503px #FFF, 1004px 1200px #FFF, 525px 1747px #FFF, 1440px 387px #FFF, 1618px 824px #FFF, 556px 626px #FFF, 1324px 165px #FFF, 1545px 746px #FFF, 923px 987px #FFF, 394px 649px #FFF, 1375px 1638px #FFF, 1540px 62px #FFF, 6px 103px #FFF, 836px 1780px #FFF, 1421px 1110px #FFF, 284px 1361px #FFF, 457px 185px #FFF, 985px 1883px #FFF, 1972px 1966px #FFF, 276px 1970px #FFF, 1670px 297px #FFF, 730px 287px #FFF, 1887px 1849px #FFF, 1635px 315px #FFF, 1430px 992px #FFF, 884px 984px #FFF, 1495px 612px #FFF, 1750px 629px #FFF, 1337px 763px #FFF, 1657px 1011px #FFF, 1015px 413px #FFF, 470px 103px #FFF, 408px 294px #FFF, 942px 1533px #FFF, 802px 1887px #FFF, 134px 756px #FFF, 1319px 1040px #FFF, 1522px 1026px #FFF, 153px 8px #FFF, 897px 1620px #FFF, 1745px 789px #FFF, 741px 1827px #FFF, 634px 1596px #FFF, 1366px 1399px #FFF, 1980px 1814px #FFF, 1859px 1254px #FFF, 1346px 1618px #FFF, 1339px 1292px #FFF, 1493px 1087px #FFF, 1005px 1241px #FFF, 425px 1823px #FFF, 50px 37px #FFF, 93px 1439px #FFF, 742px 1146px #FFF, 1769px 1129px #FFF, 832px 1997px #FFF, 1328px 654px #FFF, 841px 355px #FFF, 1885px 482px #FFF, 1493px 893px #FFF, 867px 1073px #FFF, 1908px 565px #FFF, 1164px 1017px #FFF, 457px 1956px #FFF, 1902px 1694px #FFF, 595px 488px #FFF, 1460px 1178px #FFF, 917px 1143px #FFF, 1386px 317px #FFF, 1266px 1902px #FFF, 1101px 1869px #FFF, 10px 1015px #FFF, 1930px 756px #FFF, 622px 1220px #FFF, 261px 333px #FFF, 534px 1926px #FFF, 1202px 768px #FFF, 1891px 364px #FFF, 429px 1129px #FFF, 1114px 632px #FFF, 138px 1238px #FFF, 535px 822px #FFF, 1505px 370px #FFF, 846px 962px #FFF, 720px 28px #FFF, 1078px 1282px #FFF, 667px 829px #FFF, 1052px 1903px #FFF, 124px 732px #FFF, 1774px 1684px #FFF, 1046px 867px #FFF, 1803px 595px #FFF, 509px 1408px #FFF, 1006px 188px #FFF, 1793px 1612px #FFF, 215px 340px #FFF, 1785px 879px #FFF, 1986px 416px #FFF, 840px 1585px #FFF, 1182px 811px #FFF, 120px 998px #FFF, 1337px 1106px #FFF, 781px 640px #FFF, 716px 569px #FFF, 1359px 403px #FFF, 575px 503px #FFF, 935px 648px #FFF, 335px 952px #FFF, 1669px 9px #FFF, 643px 188px #FFF, 1210px 1629px #FFF, 1435px 1324px #FFF, 1504px 290px #FFF, 1802px 1772px #FFF, 1538px 1376px #FFF, 1371px 1310px #FFF, 1603px 1997px #FFF, 694px 644px #FFF, 342px 1125px #FFF, 1155px 864px #FFF, 449px 500px #FFF, 1604px 836px #FFF, 1248px 1736px #FFF, 1847px 896px #FFF, 1203px 755px #FFF, 1553px 587px #FFF, 715px 1771px #FFF, 746px 324px #FFF, 1679px 1595px #FFF, 1115px 56px #FFF, 1116px 1295px #FFF, 243px 437px #FFF, 999px 876px #FFF, 1772px 1577px #FFF, 1448px 387px #FFF, 1213px 1371px #FFF, 236px 251px #FFF, 1582px 428px #FFF, 848px 1489px #FFF, 961px 1423px #FFF, 1897px 1008px #FFF, 920px 1345px #FFF, 1996px 505px #FFF, 1117px 1839px #FFF, 61px 1673px #FFF, 815px 1079px #FFF, 922px 654px #FFF, 858px 1543px #FFF, 700px 1341px #FFF, 292px 641px #FFF, 760px 396px #FFF, 1946px 112px #FFF, 731px 506px #FFF, 266px 1632px #FFF, 1142px 1237px #FFF, 589px 1843px #FFF, 1515px 1488px #FFF, 659px 980px #FFF, 1881px 1365px #FFF, 701px 395px #FFF, 1291px 530px #FFF, 1273px 1711px #FFF, 1044px 483px #FFF, 1147px 1287px #FFF, 1252px 650px #FFF, 313px 458px #FFF, 906px 485px #FFF, 1813px 984px #FFF, 338px 83px #FFF, 257px 190px #FFF, 934px 1487px #FFF, 1983px 1612px #FFF, 115px 1006px #FFF, 921px 1475px #FFF, 477px 395px #FFF, 662px 894px #FFF, 1190px 1476px #FFF, 1157px 1276px #FFF, 1387px 1254px #FFF, 1455px 380px #FFF, 63px 921px #FFF, 1817px 1886px #FFF, 1903px 699px #FFF, 640px 1064px #FFF, 1726px 750px #FFF, 336px 1575px #FFF, 1727px 250px #FFF, 1897px 1612px #FFF, 467px 1351px #FFF, 781px 1463px #FFF, 859px 369px #FFF, 194px 408px #FFF, 784px 1125px #FFF, 1460px 1614px #FFF, 1433px 1673px #FFF, 1427px 1144px #FFF, 952px 93px #FFF, 1855px 187px #FFF, 1749px 1236px #FFF, 1992px 737px #FFF, 606px 1901px #FFF, 318px 1558px #FFF, 207px 1683px #FFF, 1845px 474px #FFF, 1428px 154px #FFF, 835px 59px #FFF, 553px 701px #FFF, 1670px 159px #FFF, 246px 1268px #FFF, 1527px 1718px #FFF, 552px 146px #FFF, 134px 862px #FFF, 35px 1549px #FFF, 1312px 1359px #FFF, 1469px 1837px #FFF, 973px 51px #FFF, 521px 1435px #FFF, 1450px 504px #FFF, 1426px 591px #FFF, 1076px 70px #FFF, 904px 289px #FFF, 298px 1106px #FFF, 270px 1442px #FFF, 1278px 641px #FFF, 1356px 1851px #FFF, 638px 1811px #FFF, 1969px 1024px #FFF, 330px 761px #FFF, 537px 1367px #FFF, 1323px 567px #FFF, 1948px 1023px #FFF, 789px 1680px #FFF, 1921px 766px #FFF, 1121px 1539px #FFF, 571px 66px #FFF, 1308px 709px #FFF, 426px 785px #FFF, 1030px 1858px #FFF, 1194px 506px #FFF, 913px 544px #FFF, 853px 842px #FFF, 721px 1088px #FFF, 753px 1476px #FFF, 1831px 377px #FFF, 1937px 349px #FFF, 1250px 1069px #FFF, 27px 1164px #FFF, 338px 1187px #FFF, 1845px 1416px #FFF, 1640px 1984px #FFF, 278px 783px #FFF, 1315px 147px #FFF, 1546px 1548px #FFF, 419px 1790px #FFF, 1670px 964px #FFF, 1930px 1638px #FFF, 584px 1684px #FFF, 1916px 774px #FFF, 1454px 1892px #FFF, 1170px 1670px #FFF, 1833px 1698px #FFF, 1223px 1985px #FFF, 492px 1620px #FFF, 529px 1330px #FFF, 1678px 945px #FFF, 1523px 1926px #FFF, 1662px 467px #FFF, 479px 1105px #FFF, 98px 831px #FFF, 237px 128px #FFF, 1744px 690px #FFF, 1475px 808px #FFF, 500px 1613px #FFF, 1441px 573px #FFF, 1148px 1083px #FFF, 1262px 1255px #FFF, 345px 1329px #FFF, 798px 1519px #FFF, 370px 440px #FFF, 1909px 1279px #FFF, 187px 1805px #FFF, 178px 512px #FFF, 1365px 738px #FFF, 1344px 1650px #FFF, 881px 845px #FFF, 584px 510px #FFF, 695px 415px #FFF, 132px 1564px #FFF, 370px 753px #FFF, 657px 1927px #FFF, 768px 702px #FFF, 611px 335px #FFF, 1900px 1316px #FFF, 684px 382px #FFF, 1048px 1592px #FFF, 39px 492px #FFF, 1932px 1407px #FFF, 1707px 354px #FFF, 683px 851px #FFF, 1506px 510px #FFF, 1851px 1601px #FFF, 1705px 861px #FFF, 993px 1327px #FFF, 1116px 1064px #FFF, 1799px 1064px #FFF, 1030px 75px #FFF, 866px 1860px #FFF, 101px 1456px #FFF, 1231px 330px #FFF, 5px 1768px #FFF, 356px 1485px #FFF, 826px 1244px #FFF, 1813px 578px #FFF, 520px 1119px #FFF, 167px 1346px #FFF, 1694px 1907px #FFF, 1734px 1940px #FFF, 68px 1272px #FFF, 1992px 1646px #FFF, 1844px 1522px #FFF, 1099px 602px #FFF, 757px 1825px #FFF, 1344px 262px #FFF, 1705px 1791px #FFF, 411px 731px #FFF, 1039px 1584px #FFF, 790px 103px #FFF, 1950px 1027px #FFF, 1375px 1567px #FFF, 1933px 520px #FFF, 470px 1414px #FFF, 1007px 1142px #FFF, 340px 1005px #FFF, 1014px 670px #FFF, 830px 906px #FFF, 758px 382px #FFF, 832px 781px #FFF, 670px 622px #FFF, 1792px 298px #FFF, 702px 1278px #FFF, 1316px 867px #FFF, 408px 1846px #FFF, 206px 541px #FFF, 622px 1211px #FFF, 492px 359px #FFF, 1374px 1754px #FFF, 1576px 339px #FFF, 509px 1414px #FFF, 285px 769px #FFF, 1781px 52px #FFF, 1024px 302px #FFF, 104px 1740px #FFF, 605px 1284px #FFF, 119px 381px #FFF, 217px 1147px #FFF, 726px 618px #FFF, 1294px 169px #FFF, 1348px 1690px #FFF, 1456px 1640px #FFF, 1072px 514px #FFF, 225px 1160px #FFF, 592px 1130px #FFF, 521px 1925px #FFF, 762px 1369px #FFF, 1509px 1483px #FFF, 1550px 431px #FFF, 1007px 650px #FFF, 1627px 779px #FFF, 867px 498px #FFF, 1304px 1417px #FFF, 371px 1780px #FFF, 664px 494px #FFF, 1126px 431px #FFF, 1413px 194px #FFF, 961px 115px #FFF, 739px 1775px #FFF, 1387px 1153px #FFF, 990px 1845px #FFF, 941px 1577px #FFF, 1609px 880px #FFF, 1045px 1677px #FFF, 1698px 1649px #FFF, 641px 1475px #FFF, 1666px 87px #FFF, 751px 1760px #FFF, 1772px 112px #FFF, 480px 1844px #FFF, 528px 1816px #FFF, 1989px 1079px #FFF, 1690px 11px #FFF, 786px 1089px #FFF, 324px 766px #FFF, 1774px 687px #FFF, 17px 421px #FFF, 1327px 1416px #FFF, 972px 1112px #FFF, 1081px 1185px #FFF, 1929px 1051px #FFF, 886px 773px #FFF, 51px 1973px #FFF, 842px 1647px #FFF, 1584px 1495px #FFF, 507px 432px #FFF, 308px 166px #FFF, 1375px 194px #FFF, 606px 883px #FFF, 1991px 837px #FFF, 1728px 98px #FFF, 1195px 1331px #FFF, 1713px 1454px #FFF, 1877px 281px #FFF, 612px 702px #FFF, 686px 1886px #FFF, 528px 723px #FFF, 1191px 1220px #FFF, 610px 29px #FFF, 1920px 459px #FFF, 660px 808px #FFF, 1149px 1561px #FFF, 11px 1804px #FFF, 502px 779px #FFF, 333px 1024px #FFF, 1465px 1367px #FFF, 264px 1925px #FFF, 1650px 1408px #FFF, 1290px 1471px #FFF, 1315px 515px #FFF, 986px 1094px #FFF, 1121px 979px #FFF, 229px 1573px #FFF, 561px 1366px #FFF, 1143px 568px #FFF, 777px 89px #FFF, 582px 1015px #FFF, 800px 1208px #FFF, 300px 1529px #FFF, 4px 1582px #FFF, 98px 1437px #FFF, 1789px 2px #FFF, 1718px 901px #FFF, 1323px 1842px #FFF, 1192px 1601px #FFF, 1863px 1635px #FFF, 130px 311px #FFF, 1px 664px #FFF, 164px 1210px #FFF, 1808px 277px #FFF, 409px 1849px #FFF, 963px 1236px #FFF, 1147px 1418px #FFF, 56px 1715px #FFF, 102px 1921px #FFF, 925px 1565px #FFF, 1929px 1667px #FFF, 1392px 147px #FFF, 1225px 929px #FFF, 1165px 872px #FFF, 1416px 1167px #FFF, 1700px 1816px #FFF, 900px 71px #FFF, 1684px 859px #FFF, 19px 142px #FFF, 1104px 222px #FFF, 1180px 515px #FFF, 1584px 1123px #FFF, 1158px 1618px #FFF, 305px 1719px #FFF, 1170px 28px #FFF, 1469px 1577px #FFF, 1893px 619px #FFF, 1820px 1328px #FFF, 1320px 1737px #FFF, 1852px 887px #FFF, 71px 305px #FFF, 634px 1723px #FFF, 1087px 141px #FFF, 837px 190px #FFF, 882px 739px #FFF, 370px 1393px #FFF, 102px 1116px #FFF, 597px 547px #FFF, 1275px 1813px #FFF, 1828px 1032px #FFF, 16px 1200px #FFF, 922px 1310px #FFF, 679px 1787px #FFF, 1365px 381px #FFF, 292px 286px #FFF, 761px 1772px #FFF, 967px 1502px #FFF, 591px 380px #FFF, 1638px 801px #FFF, 1646px 1807px #FFF, 626px 990px #FFF, 750px 1264px #FFF, 1049px 296px #FFF, 473px 387px #FFF, 214px 1845px #FFF, 523px 585px #FFF, 1573px 1801px #FFF, 65px 699px #FFF, 1656px 793px #FFF, 546px 262px #FFF, 1723px 262px #FFF, 445px 626px #FFF, 1761px 1436px #FFF, 673px 1301px #FFF, 615px 532px #FFF, 1889px 1755px #FFF, 1552px 1549px #FFF, 1692px 832px #FFF, 1808px 1249px #FFF, 615px 991px #FFF, 1048px 826px #FFF, 711px 472px #FFF, 558px 992px #FFF, 668px 638px #FFF, 865px 1561px #FFF, 869px 1193px #FFF, 274px 1816px #FFF, 247px 1315px #FFF, 56px 1076px #FFF, 1988px 1598px #FFF, 224px 1551px #FFF, 1540px 1819px #FFF, 396px 937px #FFF, 1623px 1612px #FFF, 1432px 686px #FFF, 676px 1398px #FFF, 85px 1142px #FFF, 1309px 509px #FFF, 1227px 493px #FFF, 1907px 1867px #FFF, 1117px 949px #FFF, 992px 1977px #FFF, 387px 1613px #FFF, 1290px 860px #FFF, 651px 273px #FFF, 610px 132px #FFF, 1061px 106px #FFF, 925px 852px #FFF, 1419px 1674px #FFF, 154px 1398px #FFF, 1249px 317px #FFF, 788px 1214px #FFF, 1691px 724px #FFF, 559px 1532px #FFF, 933px 1057px #FFF, 660px 1608px #FFF, 1220px 1942px #FFF, 468px 1899px #FFF, 1003px 1071px #FFF, 908px 1287px #FFF, 854px 1210px #FFF, 1839px 1105px #FFF, 1000px 1427px #FFF, 307px 686px #FFF, 861px 1508px #FFF, 119px 655px #FFF, 547px 1088px #FFF, 1650px 108px #FFF, 447px 1727px #FFF, 320px 1157px #FFF, 1678px 813px #FFF, 1252px 1324px #FFF, 490px 982px #FFF, 1415px 449px #FFF, 1003px 779px #FFF, 1188px 1680px #FFF, 381px 375px #FFF, 192px 485px #FFF, 1093px 1714px #FFF, 1806px 1365px #FFF, 1500px 1491px #FFF, 1966px 388px #FFF, 1216px 541px #FFF, 1769px 849px #FFF, 230px 522px #FFF, 114px 662px #FFF, 244px 1984px #FFF, 105px 1462px #FFF, 1272px 286px #FFF, 1563px 1622px #FFF, 294px 1769px #FFF, 41px 350px #FFF, 1300px 1126px #FFF, 211px 495px #FFF, 1258px 1459px #FFF, 404px 1248px #FFF, 421px 1535px #FFF, 284px 1345px #FFF, 758px 1242px #FFF, 1467px 1080px #FFF;
}

#stars2 {
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: 1720px 1042px #FFF, 914px 325px #FFF, 1211px 1218px #FFF, 1489px 981px #FFF, 263px 1813px #FFF, 423px 1656px #FFF, 920px 152px #FFF, 1955px 266px #FFF, 701px 1256px #FFF, 1573px 338px #FFF, 1675px 1424px #FFF, 1212px 1850px #FFF, 306px 566px #FFF, 1785px 85px #FFF, 802px 677px #FFF, 771px 1306px #FFF, 1773px 384px #FFF, 9px 1564px #FFF, 519px 950px #FFF, 988px 295px #FFF, 993px 542px #FFF, 793px 1392px #FFF, 1733px 406px #FFF, 357px 516px #FFF, 1497px 1321px #FFF, 344px 1414px #FFF, 1068px 1624px #FFF, 1858px 40px #FFF, 878px 616px #FFF, 1171px 1802px #FFF, 696px 1237px #FFF, 68px 812px #FFF, 1708px 1737px #FFF, 741px 1490px #FFF, 1895px 1123px #FFF, 1110px 396px #FFF, 1333px 425px #FFF, 281px 1619px #FFF, 1214px 934px #FFF, 662px 1809px #FFF, 1104px 1420px #FFF, 1534px 1963px #FFF, 287px 1977px #FFF, 1428px 450px #FFF, 841px 204px #FFF, 785px 1046px #FFF, 1531px 1523px #FFF, 1689px 804px #FFF, 1359px 636px #FFF, 1200px 1681px #FFF, 36px 1455px #FFF, 1305px 969px #FFF, 1727px 1810px #FFF, 173px 1269px #FFF, 752px 875px #FFF, 1550px 1156px #FFF, 500px 35px #FFF, 137px 690px #FFF, 1010px 793px #FFF, 1638px 884px #FFF, 701px 824px #FFF, 1587px 45px #FFF, 897px 1175px #FFF, 687px 1887px #FFF, 383px 1047px #FFF, 1283px 209px #FFF, 372px 1527px #FFF, 839px 1756px #FFF, 869px 1660px #FFF, 1574px 1179px #FFF, 666px 1978px #FFF, 935px 491px #FFF, 692px 904px #FFF, 1885px 1px #FFF, 1547px 1484px #FFF, 844px 1248px #FFF, 441px 1735px #FFF, 335px 754px #FFF, 1150px 222px #FFF, 1583px 223px #FFF, 1144px 653px #FFF, 1061px 931px #FFF, 1868px 113px #FFF, 1412px 1242px #FFF, 1322px 241px #FFF, 1505px 896px #FFF, 438px 1024px #FFF, 1142px 394px #FFF, 755px 943px #FFF, 1044px 965px #FFF, 621px 669px #FFF, 1594px 575px #FFF, 1045px 778px #FFF, 754px 1916px #FFF, 1538px 290px #FFF, 248px 1183px #FFF, 803px 1640px #FFF, 1143px 1918px #FFF, 809px 856px #FFF, 1203px 1854px #FFF, 189px 769px #FFF, 1502px 1443px #FFF, 1389px 194px #FFF, 485px 1637px #FFF, 1000px 1352px #FFF, 1818px 61px #FFF, 1674px 1379px #FFF, 1265px 1712px #FFF, 923px 760px #FFF, 516px 1404px #FFF, 22px 586px #FFF, 1944px 1167px #FFF, 1929px 1241px #FFF, 348px 622px #FFF, 1960px 1386px #FFF, 880px 1586px #FFF, 889px 468px #FFF, 358px 1247px #FFF, 1889px 1464px #FFF, 841px 1780px #FFF, 1977px 1746px #FFF, 6px 1726px #FFF, 1309px 81px #FFF, 962px 1967px #FFF, 1793px 584px #FFF, 1714px 1815px #FFF, 1034px 767px #FFF, 286px 1088px #FFF, 1349px 249px #FFF, 390px 1006px #FFF, 839px 1873px #FFF, 1148px 81px #FFF, 366px 1841px #FFF, 1825px 1460px #FFF, 1679px 414px #FFF, 369px 510px #FFF, 643px 464px #FFF, 877px 482px #FFF, 1128px 943px #FFF, 1301px 1079px #FFF, 1880px 819px #FFF, 967px 1466px #FFF, 111px 1252px #FFF, 702px 1580px #FFF, 1090px 1236px #FFF, 1919px 1567px #FFF, 1290px 1544px #FFF, 989px 1144px #FFF, 1456px 1312px #FFF, 1535px 1893px #FFF, 597px 366px #FFF, 226px 841px #FFF, 610px 964px #FFF, 1868px 579px #FFF, 207px 760px #FFF, 690px 255px #FFF, 951px 45px #FFF, 978px 1430px #FFF, 1292px 798px #FFF, 841px 230px #FFF, 572px 614px #FFF, 1928px 483px #FFF, 1380px 1575px #FFF, 419px 1809px #FFF, 296px 557px #FFF, 582px 1851px #FFF, 373px 1636px #FFF, 1165px 114px #FFF, 1245px 659px #FFF, 295px 1773px #FFF, 987px 1086px #FFF, 226px 1106px #FFF, 1102px 1768px #FFF, 1379px 829px #FFF, 858px 173px #FFF, 690px 1848px #FFF, 1802px 1233px #FFF, 726px 1334px #FFF, 929px 1067px #FFF, 1039px 1927px #FFF, 1496px 1827px #FFF, 161px 870px #FFF, 1239px 1942px #FFF, 454px 1341px #FFF, 1032px 1102px #FFF, 1764px 1889px #FFF, 1754px 462px #FFF, 1175px 429px #FFF, 1227px 997px #FFF, 1978px 1058px #FFF, 1138px 473px #FFF, 1903px 744px #FFF, 884px 925px #FFF, 1087px 1231px #FFF, 1470px 1365px #FFF, 547px 304px #FFF, 1074px 275px #FFF, 118px 664px #FFF, 678px 1029px #FFF, 126px 705px #FFF;
    animation: animStar 100s linear infinite;
}

#stars2:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: 1720px 1042px #FFF, 914px 325px #FFF, 1211px 1218px #FFF, 1489px 981px #FFF, 263px 1813px #FFF, 423px 1656px #FFF, 920px 152px #FFF, 1955px 266px #FFF, 701px 1256px #FFF, 1573px 338px #FFF, 1675px 1424px #FFF, 1212px 1850px #FFF, 306px 566px #FFF, 1785px 85px #FFF, 802px 677px #FFF, 771px 1306px #FFF, 1773px 384px #FFF, 9px 1564px #FFF, 519px 950px #FFF, 988px 295px #FFF, 993px 542px #FFF, 793px 1392px #FFF, 1733px 406px #FFF, 357px 516px #FFF, 1497px 1321px #FFF, 344px 1414px #FFF, 1068px 1624px #FFF, 1858px 40px #FFF, 878px 616px #FFF, 1171px 1802px #FFF, 696px 1237px #FFF, 68px 812px #FFF, 1708px 1737px #FFF, 741px 1490px #FFF, 1895px 1123px #FFF, 1110px 396px #FFF, 1333px 425px #FFF, 281px 1619px #FFF, 1214px 934px #FFF, 662px 1809px #FFF, 1104px 1420px #FFF, 1534px 1963px #FFF, 287px 1977px #FFF, 1428px 450px #FFF, 841px 204px #FFF, 785px 1046px #FFF, 1531px 1523px #FFF, 1689px 804px #FFF, 1359px 636px #FFF, 1200px 1681px #FFF, 36px 1455px #FFF, 1305px 969px #FFF, 1727px 1810px #FFF, 173px 1269px #FFF, 752px 875px #FFF, 1550px 1156px #FFF, 500px 35px #FFF, 137px 690px #FFF, 1010px 793px #FFF, 1638px 884px #FFF, 701px 824px #FFF, 1587px 45px #FFF, 897px 1175px #FFF, 687px 1887px #FFF, 383px 1047px #FFF, 1283px 209px #FFF, 372px 1527px #FFF, 839px 1756px #FFF, 869px 1660px #FFF, 1574px 1179px #FFF, 666px 1978px #FFF, 935px 491px #FFF, 692px 904px #FFF, 1885px 1px #FFF, 1547px 1484px #FFF, 844px 1248px #FFF, 441px 1735px #FFF, 335px 754px #FFF, 1150px 222px #FFF, 1583px 223px #FFF, 1144px 653px #FFF, 1061px 931px #FFF, 1868px 113px #FFF, 1412px 1242px #FFF, 1322px 241px #FFF, 1505px 896px #FFF, 438px 1024px #FFF, 1142px 394px #FFF, 755px 943px #FFF, 1044px 965px #FFF, 621px 669px #FFF, 1594px 575px #FFF, 1045px 778px #FFF, 754px 1916px #FFF, 1538px 290px #FFF, 248px 1183px #FFF, 803px 1640px #FFF, 1143px 1918px #FFF, 809px 856px #FFF, 1203px 1854px #FFF, 189px 769px #FFF, 1502px 1443px #FFF, 1389px 194px #FFF, 485px 1637px #FFF, 1000px 1352px #FFF, 1818px 61px #FFF, 1674px 1379px #FFF, 1265px 1712px #FFF, 923px 760px #FFF, 516px 1404px #FFF, 22px 586px #FFF, 1944px 1167px #FFF, 1929px 1241px #FFF, 348px 622px #FFF, 1960px 1386px #FFF, 880px 1586px #FFF, 889px 468px #FFF, 358px 1247px #FFF, 1889px 1464px #FFF, 841px 1780px #FFF, 1977px 1746px #FFF, 6px 1726px #FFF, 1309px 81px #FFF, 962px 1967px #FFF, 1793px 584px #FFF, 1714px 1815px #FFF, 1034px 767px #FFF, 286px 1088px #FFF, 1349px 249px #FFF, 390px 1006px #FFF, 839px 1873px #FFF, 1148px 81px #FFF, 366px 1841px #FFF, 1825px 1460px #FFF, 1679px 414px #FFF, 369px 510px #FFF, 643px 464px #FFF, 877px 482px #FFF, 1128px 943px #FFF, 1301px 1079px #FFF, 1880px 819px #FFF, 967px 1466px #FFF, 111px 1252px #FFF, 702px 1580px #FFF, 1090px 1236px #FFF, 1919px 1567px #FFF, 1290px 1544px #FFF, 989px 1144px #FFF, 1456px 1312px #FFF, 1535px 1893px #FFF, 597px 366px #FFF, 226px 841px #FFF, 610px 964px #FFF, 1868px 579px #FFF, 207px 760px #FFF, 690px 255px #FFF, 951px 45px #FFF, 978px 1430px #FFF, 1292px 798px #FFF, 841px 230px #FFF, 572px 614px #FFF, 1928px 483px #FFF, 1380px 1575px #FFF, 419px 1809px #FFF, 296px 557px #FFF, 582px 1851px #FFF, 373px 1636px #FFF, 1165px 114px #FFF, 1245px 659px #FFF, 295px 1773px #FFF, 987px 1086px #FFF, 226px 1106px #FFF, 1102px 1768px #FFF, 1379px 829px #FFF, 858px 173px #FFF, 690px 1848px #FFF, 1802px 1233px #FFF, 726px 1334px #FFF, 929px 1067px #FFF, 1039px 1927px #FFF, 1496px 1827px #FFF, 161px 870px #FFF, 1239px 1942px #FFF, 454px 1341px #FFF, 1032px 1102px #FFF, 1764px 1889px #FFF, 1754px 462px #FFF, 1175px 429px #FFF, 1227px 997px #FFF, 1978px 1058px #FFF, 1138px 473px #FFF, 1903px 744px #FFF, 884px 925px #FFF, 1087px 1231px #FFF, 1470px 1365px #FFF, 547px 304px #FFF, 1074px 275px #FFF, 118px 664px #FFF, 678px 1029px #FFF, 126px 705px #FFF;
}

#stars3 {
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: 1761px 212px #FFF, 364px 1971px #FFF, 884px 1534px #FFF, 1681px 841px #FFF, 615px 634px #FFF, 5px 1705px #FFF, 259px 251px #FFF, 60px 518px #FFF, 722px 604px #FFF, 1130px 1393px #FFF, 1949px 55px #FFF, 715px 1988px #FFF, 488px 1558px #FFF, 1931px 338px #FFF, 565px 788px #FFF, 1096px 1022px #FFF, 1810px 234px #FFF, 411px 755px #FFF, 671px 102px #FFF, 252px 874px #FFF, 1453px 19px #FFF, 1020px 143px #FFF, 337px 1713px #FFF, 1978px 303px #FFF, 388px 1539px #FFF, 1139px 1430px #FFF, 1462px 111px #FFF, 1156px 1426px #FFF, 443px 1442px #FFF, 1640px 1019px #FFF, 794px 1721px #FFF, 648px 544px #FFF, 44px 16px #FFF, 728px 1660px #FFF, 20px 948px #FFF, 1241px 1746px #FFF, 4px 1732px #FFF, 746px 627px #FFF, 475px 1289px #FFF, 1485px 755px #FFF, 759px 1046px #FFF, 1949px 1045px #FFF, 1763px 1578px #FFF, 228px 1824px #FFF, 1622px 1229px #FFF, 730px 1635px #FFF, 1158px 322px #FFF, 215px 751px #FFF, 552px 177px #FFF, 491px 1352px #FFF, 1013px 1262px #FFF, 1020px 1086px #FFF, 367px 545px #FFF, 720px 146px #FFF, 1356px 854px #FFF, 1819px 1522px #FFF, 1608px 901px #FFF, 1750px 1621px #FFF, 911px 990px #FFF, 1781px 365px #FFF, 976px 280px #FFF, 1881px 65px #FFF, 1399px 2000px #FFF, 525px 450px #FFF, 1960px 1417px #FFF, 489px 448px #FFF, 1300px 887px #FFF, 59px 545px #FFF, 369px 1214px #FFF, 892px 1335px #FFF, 1017px 1181px #FFF, 1391px 813px #FFF, 69px 1691px #FFF, 371px 328px #FFF, 607px 144px #FFF, 1311px 729px #FFF, 462px 1692px #FFF, 1589px 1677px #FFF, 1869px 117px #FFF, 342px 1230px #FFF, 1947px 1882px #FFF, 1940px 376px #FFF, 1212px 18px #FFF, 867px 1435px #FFF, 315px 1830px #FFF, 1740px 976px #FFF, 184px 655px #FFF, 217px 1137px #FFF, 1132px 147px #FFF, 551px 488px #FFF, 944px 1321px #FFF, 729px 417px #FFF, 1817px 358px #FFF, 290px 955px #FFF, 1051px 993px #FFF, 1600px 1772px #FFF, 81px 1651px #FFF, 430px 1494px #FFF, 1959px 1895px #FFF, 1049px 1151px #FFF;
    animation: animStar 150s linear infinite;
}

#stars3:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: 1761px 212px #FFF, 364px 1971px #FFF, 884px 1534px #FFF, 1681px 841px #FFF, 615px 634px #FFF, 5px 1705px #FFF, 259px 251px #FFF, 60px 518px #FFF, 722px 604px #FFF, 1130px 1393px #FFF, 1949px 55px #FFF, 715px 1988px #FFF, 488px 1558px #FFF, 1931px 338px #FFF, 565px 788px #FFF, 1096px 1022px #FFF, 1810px 234px #FFF, 411px 755px #FFF, 671px 102px #FFF, 252px 874px #FFF, 1453px 19px #FFF, 1020px 143px #FFF, 337px 1713px #FFF, 1978px 303px #FFF, 388px 1539px #FFF, 1139px 1430px #FFF, 1462px 111px #FFF, 1156px 1426px #FFF, 443px 1442px #FFF, 1640px 1019px #FFF, 794px 1721px #FFF, 648px 544px #FFF, 44px 16px #FFF, 728px 1660px #FFF, 20px 948px #FFF, 1241px 1746px #FFF, 4px 1732px #FFF, 746px 627px #FFF, 475px 1289px #FFF, 1485px 755px #FFF, 759px 1046px #FFF, 1949px 1045px #FFF, 1763px 1578px #FFF, 228px 1824px #FFF, 1622px 1229px #FFF, 730px 1635px #FFF, 1158px 322px #FFF, 215px 751px #FFF, 552px 177px #FFF, 491px 1352px #FFF, 1013px 1262px #FFF, 1020px 1086px #FFF, 367px 545px #FFF, 720px 146px #FFF, 1356px 854px #FFF, 1819px 1522px #FFF, 1608px 901px #FFF, 1750px 1621px #FFF, 911px 990px #FFF, 1781px 365px #FFF, 976px 280px #FFF, 1881px 65px #FFF, 1399px 2000px #FFF, 525px 450px #FFF, 1960px 1417px #FFF, 489px 448px #FFF, 1300px 887px #FFF, 59px 545px #FFF, 369px 1214px #FFF, 892px 1335px #FFF, 1017px 1181px #FFF, 1391px 813px #FFF, 69px 1691px #FFF, 371px 328px #FFF, 607px 144px #FFF, 1311px 729px #FFF, 462px 1692px #FFF, 1589px 1677px #FFF, 1869px 117px #FFF, 342px 1230px #FFF, 1947px 1882px #FFF, 1940px 376px #FFF, 1212px 18px #FFF, 867px 1435px #FFF, 315px 1830px #FFF, 1740px 976px #FFF, 184px 655px #FFF, 217px 1137px #FFF, 1132px 147px #FFF, 551px 488px #FFF, 944px 1321px #FFF, 729px 417px #FFF, 1817px 358px #FFF, 290px 955px #FFF, 1051px 993px #FFF, 1600px 1772px #FFF, 81px 1651px #FFF, 430px 1494px #FFF, 1959px 1895px #FFF, 1049px 1151px #FFF;
}

.landing-container {
    position: fixed;
    height: 100%;
    width: 100%;
    font-family: "lato", sans-serif;
    color: #FFF;
    background: radial-gradient(ellipse at bottom, #0c1116 0%, #090a0f 100%);
}

#horizon {
    position: absolute;
    width: 160%;
    height: 70%;
    border-radius: 100%/100%;
    background: #51AFFF;
    filter: blur(30px);
    -webkit-filter: blur(30px);
    left: 50%;
    bottom: -40%;
    margin-left: -80%;
}

#horizon:before {
    content: " ";
    position: absolute;
    width: 81.25%;
    height: 70%;
    border-radius: 100%/100%;
    background: #51AFFF;
    filter: blur(30px);
    -webkit-filter: blur(30px);
    opacity: 0.6;
    margin-left: 9.375%;
    left: 0;
}

#horizon:after {
    content: " ";
    position: absolute;
    width: 32%;
    height: 20%;
    border-radius: 650px/350px;
    background: #215496;
    filter: blur(30px);
    -webkit-filter: blur(30px);
    opacity: 0.5;
    margin-left: 34%;
    left: 0;
}

#horizon .glow {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 100%/100%;
    background: #FF92BC;
    filter: blur(30px);
    -webkit-filter: blur(200px);
    opacity: 0.7;
    top: -10%;
}

#earth {
    position: absolute;
    width: 200%;
    height: 100%;
    background: black;
    border-radius: 100%/100%;
    left: 50%;
    bottom: -70%;
    margin-left: -100%;
}

#earth:before {
    left: 0;
    content: " ";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 100%/100%;
    box-shadow: inset 0px 0px 62px 20px rgba(60, 105, 138, 0.85);
}

#earth:after {
    left: 0;
    *zoom: 1;
    filter: progid:DXImageTransform.Microsoft.gradient(gradientType=1, startColorstr='#FF000000', endColorstr='#FF000000');
    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuMCIgeTE9IjAuNSIgeDI9IjEuMCIgeTI9IjAuNSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIvPjxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjMDAwMDAwIiBzdG9wLW9wYWNpdHk9IjAuMCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==');
    background-size: 100%;
    background-image: -webkit-gradient(linear, 0% 50%, 100% 50%, color-stop(0%, #000000), color-stop(50%, rgba(0, 0, 0, 0)), color-stop(100%, #000000));
    background-image: -moz-linear-gradient(left, #000000 0%, rgba(0, 0, 0, 0) 50%, #000000 100%);
    background-image: -webkit-linear-gradient(left, #000000 0%, rgba(0, 0, 0, 0) 50%, #000000 100%);
    background-image: linear-gradient(to right, #000000 0%, rgba(0, 0, 0, 0) 50%, #000000 100%);
    content: " ";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 100%/100%;
}

#title {
    position: absolute;
    font-weight: 300;
    top: 56%;
    left: 0;
    right: 0;
    margin-top: -80px;
    font-size: 130px;
    text-align: center;
    letter-spacing: 25px;
    padding-left: 25px;
    background: -webkit-linear-gradient(white, #dbdde0, #38495a);
    background-clip: text;
    -webkit-background-clip: text;
    animation-duration: 6s;
    animation-timing-function: ease-in-out;
    animation-name: animTitle;
}

#subtitle {
    position: absolute;
    font-weight: 300;
    top: 80%;
    left: 0;
    right: 0;
    font-size: 25px;
    text-align: center;
    letter-spacing: 6px;
}

#subtitle span {
    color: #d8d8d8;
    animation-duration: 6s;
    animation-timing-function: ease;
}

#subtitle span:nth-child(1) {
    animation-name: animOne;
}

#subtitle span:nth-child(2) {
    animation-name: animTwo;
}

#subtitle span:nth-child(3) {
    animation-name: animThree;
}

.notice {
    position: fixed;
    color: rgb(177, 177, 177);
    bottom: 30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease;
    animation-duration: 6s;
}

a {
    text-decoration: none;
    color: #E56D9B;
}

@keyframes fadeInOpacity {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes animStar {
    from {
        transform: translateY(0px);
    }

    to {
        transform: translateY(-2000px);
    }
}

@keyframes animTitle {
    0% {
        transform: translateY(-26px);
        opacity: 0;
    }

    30%,
    100% {
        transform: translateY(0px);
        opacity: 1;
    }
}

@keyframes animOne {

    0%,
    15% {
        transform: translateY(-26px);
        opacity: 0;
    }

    35%,
    80% {
        transform: translateY(0px);
        opacity: 1;
    }

    92%,
    100% {
        transform: translateY(-4px);
    }
}

@keyframes animTwo {

    0%,
    25% {
        transform: translateY(-26px);
        opacity: 0;
    }

    45%,
    80% {
        transform: translateY(0px);
        opacity: 1;
    }

    92%,
    100% {
        transform: translateY(-4px);
    }
}

@keyframes animThree {

    0%,
    35% {
        transform: translateY(-26px);
        opacity: 0;
    }

    55%,
    80% {
        transform: translateY(0px);
        opacity: 1;
    }

    92%,
    100% {
        transform: translateY(-4px);
    }
}
</style>

<style>
html {
    overflow: hidden !important;
}
</style>
