;; WebAssembly Text Format for Financial Calculations
;; Optimized calculations for investment projections, compound interest, etc.

(module
  ;; Import memory from JavaScript
  (import "env" "memory" (memory 1))
  
  ;; Import math functions
  (import "env" "log" (func $log (param f64) (result f64)))
  (import "env" "pow" (func $pow (param f64 f64) (result f64)))
  (import "env" "sqrt" (func $sqrt (param f64) (result f64)))

  ;; Export functions to JavaScript
  (export "compound_interest" (func $compound_interest))
  (export "present_value" (func $present_value))
  (export "future_value" (func $future_value))
  (export "annuity_payment" (func $annuity_payment))
  (export "loan_payment" (func $loan_payment))
  (export "investment_growth" (func $investment_growth))
  (export "portfolio_volatility" (func $portfolio_volatility))
  (export "sharpe_ratio" (func $sharpe_ratio))
  (export "beta_calculation" (func $beta_calculation))
  (export "mortgage_payment" (func $mortgage_payment))

  ;; Compound Interest: A = P(1 + r/n)^(nt)
  ;; Parameters: principal, rate, compounds_per_year, years
  (func $compound_interest (param $principal f64) (param $rate f64) (param $compounds f64) (param $years f64) (result f64)
    (local $base f64)
    (local $exponent f64)
    
    ;; Calculate (1 + r/n)
    local.get $rate
    local.get $compounds
    f64.div
    f64.const 1.0
    f64.add
    local.set $base
    
    ;; Calculate nt
    local.get $compounds
    local.get $years
    f64.mul
    local.set $exponent
    
    ;; Calculate P * (1 + r/n)^(nt)
    local.get $principal
    local.get $base
    local.get $exponent
    call $pow
    f64.mul
  )

  ;; Present Value: PV = FV / (1 + r)^n
  (func $present_value (param $future_value f64) (param $rate f64) (param $periods f64) (result f64)
    local.get $future_value
    f64.const 1.0
    local.get $rate
    f64.add
    local.get $periods
    call $pow
    f64.div
  )

  ;; Future Value: FV = PV * (1 + r)^n
  (func $future_value (param $present_value f64) (param $rate f64) (param $periods f64) (result f64)
    local.get $present_value
    f64.const 1.0
    local.get $rate
    f64.add
    local.get $periods
    call $pow
    f64.mul
  )

  ;; Annuity Payment: PMT = PV * [r(1+r)^n] / [(1+r)^n - 1]
  (func $annuity_payment (param $present_value f64) (param $rate f64) (param $periods f64) (result f64)
    (local $factor f64)
    (local $numerator f64)
    (local $denominator f64)
    
    ;; Calculate (1 + r)^n
    f64.const 1.0
    local.get $rate
    f64.add
    local.get $periods
    call $pow
    local.set $factor
    
    ;; Calculate numerator: r * (1+r)^n
    local.get $rate
    local.get $factor
    f64.mul
    local.set $numerator
    
    ;; Calculate denominator: (1+r)^n - 1
    local.get $factor
    f64.const 1.0
    f64.sub
    local.set $denominator
    
    ;; Calculate PMT
    local.get $present_value
    local.get $numerator
    local.get $denominator
    f64.div
    f64.mul
  )

  ;; Loan Payment (same as annuity payment but with different context)
  (func $loan_payment (param $principal f64) (param $monthly_rate f64) (param $months f64) (result f64)
    local.get $principal
    local.get $monthly_rate
    local.get $months
    call $annuity_payment
  )

  ;; Investment Growth with regular contributions
  (func $investment_growth (param $initial f64) (param $monthly_contribution f64) (param $annual_rate f64) (param $years f64) (result f64)
    (local $monthly_rate f64)
    (local $months f64)
    (local $future_initial f64)
    (local $future_annuity f64)
    (local $annuity_factor f64)
    
    ;; Convert to monthly rate and periods
    local.get $annual_rate
    f64.const 12.0
    f64.div
    local.set $monthly_rate
    
    local.get $years
    f64.const 12.0
    f64.mul
    local.set $months
    
    ;; Future value of initial investment
    local.get $initial
    local.get $monthly_rate
    local.get $months
    call $future_value
    local.set $future_initial
    
    ;; Future value of annuity (monthly contributions)
    ;; FV = PMT * [((1+r)^n - 1) / r]
    f64.const 1.0
    local.get $monthly_rate
    f64.add
    local.get $months
    call $pow
    f64.const 1.0
    f64.sub
    local.get $monthly_rate
    f64.div
    local.set $annuity_factor
    
    local.get $monthly_contribution
    local.get $annuity_factor
    f64.mul
    local.set $future_annuity
    
    ;; Total future value
    local.get $future_initial
    local.get $future_annuity
    f64.add
  )

  ;; Portfolio Volatility (standard deviation)
  ;; Simplified version - assumes data is already in memory
  (func $portfolio_volatility (param $data_offset i32) (param $count i32) (param $mean f64) (result f64)
    (local $i i32)
    (local $sum_squares f64)
    (local $value f64)
    (local $diff f64)
    (local $variance f64)
    
    i32.const 0
    local.set $i
    f64.const 0.0
    local.set $sum_squares
    
    ;; Calculate sum of squared differences
    (loop $calculate_variance
      local.get $i
      local.get $count
      i32.lt_s
      if
        ;; Load value from memory
        local.get $data_offset
        local.get $i
        i32.const 8
        i32.mul
        i32.add
        f64.load
        local.set $value
        
        ;; Calculate (value - mean)^2
        local.get $value
        local.get $mean
        f64.sub
        local.set $diff
        
        local.get $sum_squares
        local.get $diff
        local.get $diff
        f64.mul
        f64.add
        local.set $sum_squares
        
        ;; Increment counter
        local.get $i
        i32.const 1
        i32.add
        local.set $i
        
        br $calculate_variance
      end
    )
    
    ;; Calculate variance and standard deviation
    local.get $sum_squares
    local.get $count
    i32.const 1
    i32.sub
    f64.convert_i32_s
    f64.div
    local.set $variance
    
    local.get $variance
    call $sqrt
  )

  ;; Sharpe Ratio: (Return - Risk Free Rate) / Standard Deviation
  (func $sharpe_ratio (param $portfolio_return f64) (param $risk_free_rate f64) (param $volatility f64) (result f64)
    local.get $portfolio_return
    local.get $risk_free_rate
    f64.sub
    local.get $volatility
    f64.div
  )

  ;; Beta Calculation (simplified)
  (func $beta_calculation (param $covariance f64) (param $market_variance f64) (result f64)
    local.get $covariance
    local.get $market_variance
    f64.div
  )

  ;; Mortgage Payment with PMI and taxes
  (func $mortgage_payment (param $principal f64) (param $annual_rate f64) (param $years f64) (param $pmi_rate f64) (param $property_tax_rate f64) (param $home_value f64) (result f64)
    (local $monthly_rate f64)
    (local $months f64)
    (local $base_payment f64)
    (local $pmi_payment f64)
    (local $tax_payment f64)
    
    ;; Convert to monthly
    local.get $annual_rate
    f64.const 12.0
    f64.div
    local.set $monthly_rate
    
    local.get $years
    f64.const 12.0
    f64.mul
    local.set $months
    
    ;; Calculate base mortgage payment
    local.get $principal
    local.get $monthly_rate
    local.get $months
    call $loan_payment
    local.set $base_payment
    
    ;; Calculate PMI (monthly)
    local.get $principal
    local.get $pmi_rate
    f64.mul
    f64.const 12.0
    f64.div
    local.set $pmi_payment
    
    ;; Calculate property tax (monthly)
    local.get $home_value
    local.get $property_tax_rate
    f64.mul
    f64.const 12.0
    f64.div
    local.set $tax_payment
    
    ;; Total monthly payment
    local.get $base_payment
    local.get $pmi_payment
    f64.add
    local.get $tax_payment
    f64.add
  )
)