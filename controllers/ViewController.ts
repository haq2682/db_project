import sql from "../db_config/config"

const ViewController = {
    dailyPurchase: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM daily_purchase`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    totalDailyPurchase: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM total_daily_purchase_cost`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    totalMonthlyPurchase: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM total_monthly_purchase_cost`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    totalYearlyPurchase: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM total_yearly_purchase_cost`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    purchaseBetweenDateTime: async (from:Date, to:Date) => {
        await new Promise(() => {
            sql.query(`SELECT * FROM total_purchase_cost_between_dates WHERE purchase_date BETWEEN ? AND ?`, [from, to], function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    dailyProfit: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM daily_profit`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    totalDailyProfit: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM total_daily_profit`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    totalMonthlyProfit: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM total_monthly_profit`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    totalYearlyProfit: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM total_yearly_profit`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    profitBetweenDateTime: async (from:Date, to:Date) => {
        await new Promise(() => {
            sql.query(`SELECT * FROM profit_between_specific_dates WHERE sale_date BETWEEN ? AND ?`, [from, to], function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    dailySales: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM daily_sales`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    totalDailySales: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM total_daily_sales`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    totalMonthlySales: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM total_monthly_sales`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    totalYearlySales: async () => {
        await new Promise(() => {
            sql.query(`SELECT * FROM total_yearly_sales`, function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    saleOnSpecificDay: async (day:Date) => {
        await new Promise(() => {
            sql.query(`SELECT * FROM products_sold_on_specific_day WHERE sale_date=?`, [day], function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    },
    saleBetweenDateTime: async (from:Date, to:Date) => {
        await new Promise(() => {
            sql.query(`SELECT * FROM products_sold_on_specific_day WHERE sale_date BETWEEN ? AND ?`, [from, to], function(error, results) {
                error ? console.error(error) : console.log(results);
            })
        })
    }
}

export default ViewController;