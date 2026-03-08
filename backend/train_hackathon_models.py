#!/usr/bin/env python3
"""
Hackathon Flood Forecasting Training Pipeline
==============================================
Complete training and demonstration script for the AI-powered flood prediction system.

This script demonstrates:
1. Hydrological data simulation (watershed model)
2. Feature extraction for ML training
3. LSTM time-series model training
4. Random Forest classifier training
5. Model evaluation with visualization
6. Sample predictions with explanations

Usage:
    python train_hackathon_models.py [--river cauvery|vrishabhavathi|brahmaputra] [--days 730]
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os
import sys
import argparse
from datetime import datetime, timedelta
import json
from typing import Dict, Tuple, List

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import our modules
from data.hydrological_simulator import HydrologicalSimulator, INDIA_RIVERS
from ml.rf_flood_classifier import RandomForestFloodClassifier
from ml.lstm_flood_model import LSTMFloodModel, FloodLevelPredictor


def print_header(title: str):
    """Print a formatted section header."""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70 + "\n")


def train_and_evaluate(
    river_id: str = "cauvery",
    num_days: int = 730,
    save_models: bool = True,
    show_plots: bool = True
) -> Dict:
    """
    Complete training pipeline for flood prediction models.
    
    Args:
        river_id: River to train on (cauvery, vrishabhavathi, brahmaputra)
        num_days: Days of data to simulate
        save_models: Whether to save trained models
        show_plots: Whether to display visualization plots
        
    Returns:
        Dictionary with training results and metrics
    """
    results = {
        "river_id": river_id,
        "river_name": INDIA_RIVERS[river_id]["name"],
        "timestamp": datetime.now().isoformat(),
        "training_days": num_days,
    }
    
    # =========================================================================
    # STEP 1: Data Generation using Hydrological Model
    # =========================================================================
    print_header("STEP 1: Hydrological Data Simulation")
    
    print(f"🌊 Simulating flood data for: {INDIA_RIVERS[river_id]['name']}")
    print(f"   Region: {INDIA_RIVERS[river_id]['region']}")
    print(f"   Danger Level: {INDIA_RIVERS[river_id]['danger_level']}m")
    print(f"   Warning Level: {INDIA_RIVERS[river_id]['warning_level']}m")
    print(f"   Simulation Period: {num_days} days ({num_days/365:.1f} years)")
    
    # Create simulator
    simulator = HydrologicalSimulator(river_id=river_id)
    
    # Generate data
    print("\n📊 Generating synthetic data using watershed model:")
    print("   Formula: river_level[t] = 0.8 × level[t-1] + 0.2 × rainfall[t] - 0.1 × evaporation")
    
    dataset = simulator.generate_full_dataset(
        num_days=num_days,
        save_path="backend/data"
    )
    
    # Dataset statistics
    meta = dataset["metadata"]
    print(f"\n✅ Dataset generated:")
    print(f"   Total samples: {len(dataset['full_timeseries'])}")
    print(f"   Training samples: {len(dataset['X_train'])}")
    print(f"   Test samples: {len(dataset['X_test'])}")
    print(f"   Flood days: {meta['num_flood_days']} ({meta['flood_percentage']:.1f}%)")
    print(f"   Features: {len(dataset['feature_names'])}")
    print(f"   Feature names: {dataset['feature_names']}")
    
    results["data_generation"] = {
        "total_samples": len(dataset["full_timeseries"]),
        "train_samples": len(dataset["X_train"]),
        "test_samples": len(dataset["X_test"]),
        "flood_days": meta["num_flood_days"],
        "flood_percentage": meta["flood_percentage"],
        "features": dataset["feature_names"],
    }
    
    # =========================================================================
    # STEP 2: Feature Analysis
    # =========================================================================
    print_header("STEP 2: Feature Extraction & Analysis")
    
    print("📈 Extracted features for each day:")
    for i, name in enumerate(dataset["feature_names"]):
        desc = {
            "rainfall_today": "Current day's rainfall (mm)",
            "rainfall_2day_sum": "Sum of last 2 days rainfall (mm)",
            "rainfall_3day_sum": "Sum of last 3 days rainfall (mm) - KEY PREDICTOR",
            "rainfall_week_avg": "Average rainfall over last 7 days (mm)",
            "rainfall_week_max": "Maximum daily rainfall in last week (mm)",
            "prev_river_level": "Previous day's river level (m) - KEY PREDICTOR",
            "level_change_rate": "Daily change in river level (m/day)",
            "soil_saturation_proxy": "Cumulative rainfall indicator (proxy for soil moisture)",
            "days_since_heavy_rain": "Days since rainfall > 50mm",
        }.get(name, "")
        print(f"   {i+1}. {name}: {desc}")
    
    # Analyze correlations
    X_train = dataset["X_train"]
    y_train_reg = dataset["y_train_regression"]
    y_train_cls = dataset["y_train_classification"]
    
    print("\n📊 Feature-Target Correlations (with next-day river level):")
    for i, name in enumerate(dataset["feature_names"]):
        corr = np.corrcoef(X_train[:, i], y_train_reg)[0, 1]
        bar = "█" * int(abs(corr) * 20)
        print(f"   {name:25s}: {corr:+.3f} |{bar}")
    
    # =========================================================================
    # STEP 3: Random Forest Classifier Training
    # =========================================================================
    print_header("STEP 3: Random Forest Classifier Training")
    
    print("🌳 Training Random Forest for flood/no-flood classification...")
    print("   Configuration:")
    print("   - Trees: 100")
    print("   - Max Depth: 10")
    print("   - Class Weights: Balanced (handles class imbalance)")
    
    rf_classifier = RandomForestFloodClassifier(
        n_estimators=100,
        max_depth=10,
        class_weight="balanced"
    )
    
    rf_metrics = rf_classifier.train(
        X_train, y_train_cls,
        feature_names=dataset["feature_names"],
        model_save_path=f"backend/models/rf_flood_{river_id}.joblib" if save_models else None
    )
    
    results["random_forest"] = {
        "accuracy": rf_metrics["test"]["accuracy"],
        "precision": rf_metrics["test"]["precision"],
        "recall": rf_metrics["test"]["recall"],
        "f1_score": rf_metrics["test"]["f1"],
        "roc_auc": rf_metrics["test"].get("roc_auc", 0),
        "feature_importance": rf_metrics["feature_importance"],
        "cv_mean": rf_metrics["cv_scores"]["mean"],
    }
    
    print("\n🔍 Feature Importance Analysis:")
    print("   The model learned these patterns:")
    for i, (feat, imp) in enumerate(rf_metrics["feature_importance"].items()):
        if i < 5:
            bar = "█" * int(imp * 50)
            print(f"   {i+1}. {feat:25s}: {imp:.3f} |{bar}")
    
    # Key insight
    top_feature = list(rf_metrics["feature_importance"].keys())[0]
    print(f"\n💡 KEY INSIGHT: '{top_feature}' is the most important predictor!")
    if "rainfall_3day" in top_feature or "prev_river" in top_feature:
        print("   This confirms the hydrological principle that consecutive heavy")
        print("   rainfall accumulates and causes river levels to rise dangerously.")
    
    # =========================================================================
    # STEP 4: LSTM Time-Series Model (if TensorFlow available)
    # =========================================================================
    print_header("STEP 4: LSTM Time-Series Model Training")
    
    try:
        import tensorflow as tf
        print(f"✅ TensorFlow {tf.__version__} available - training real LSTM model")
        
        lstm_model = LSTMFloodModel(sequence_length=7, n_features=2)
        
        # Prepare sequences
        rainfall = dataset["full_timeseries"]["rainfall_mm"].values
        river_level = dataset["full_timeseries"]["river_level_m"].values
        X_seq, y_seq = lstm_model.prepare_sequences(rainfall, river_level)
        
        print(f"   Prepared {len(X_seq)} sequences of 7 days each")
        print(f"   Training LSTM with architecture: Input(7×2) → LSTM(64) → LSTM(32) → Dense(1)")
        
        # Train
        history = lstm_model.train(
            X_seq, y_seq,
            epochs=50,
            batch_size=32,
            model_save_path=f"backend/models/lstm_flood_{river_id}.h5" if save_models else None,
            verbose=0
        )
        
        results["lstm"] = {
            "trained": True,
            "train_mae": lstm_model.model_metadata.get("train_mae", 0),
            "val_mae": lstm_model.model_metadata.get("val_mae", 0),
            "epochs": lstm_model.model_metadata.get("epochs_completed", 0),
        }
        
        print(f"\n✅ LSTM Training Complete:")
        print(f"   Train MAE: {results['lstm']['train_mae']:.4f}m")
        print(f"   Val MAE: {results['lstm']['val_mae']:.4f}m")
        
    except ImportError:
        print("⚠️ TensorFlow not available - skipping LSTM training")
        print("   Install with: pip install tensorflow")
        results["lstm"] = {"trained": False, "reason": "TensorFlow not installed"}
    
    # =========================================================================
    # STEP 5: Model Evaluation & Predictions
    # =========================================================================
    print_header("STEP 5: Model Evaluation & Sample Predictions")
    
    # Test predictions
    X_test = dataset["X_test"]
    y_test_cls = dataset["y_test_classification"]
    y_test_reg = dataset["y_test_regression"]
    
    print("🎯 Testing model on held-out data...")
    
    # RF predictions
    rf_pred, rf_prob = rf_classifier.predict(X_test)
    
    # Show sample predictions
    print("\n📋 Sample Predictions (first 10 test samples):")
    print("-" * 80)
    print(f"{'Rainfall 3d':>12} {'Prev Level':>12} {'Actual':>10} {'Predicted':>12} {'Prob':>8} {'Correct':>8}")
    print("-" * 80)
    
    correct = 0
    for i in range(min(10, len(X_test))):
        rain_3d = X_test[i, 2]  # rainfall_3day_sum
        prev_level = X_test[i, 5]  # prev_river_level
        actual = "FLOOD" if y_test_cls[i] == 1 else "SAFE"
        predicted = "FLOOD" if rf_pred[i] == 1 else "SAFE"
        prob = rf_prob[i] * 100
        is_correct = "✓" if rf_pred[i] == y_test_cls[i] else "✗"
        if rf_pred[i] == y_test_cls[i]:
            correct += 1
        print(f"{rain_3d:>12.1f}mm {prev_level:>10.1f}m {actual:>10} {predicted:>12} {prob:>7.1f}% {is_correct:>8}")
    
    print("-" * 80)
    print(f"Sample accuracy: {correct}/10 ({correct*10}%)")
    
    # =========================================================================
    # STEP 6: Pattern Discovery
    # =========================================================================
    print_header("STEP 6: Discovered Flood Patterns")
    
    # Analyze when floods occur
    flood_indices = np.where(y_train_cls == 1)[0]
    if len(flood_indices) > 0:
        flood_features = X_train[flood_indices]
        normal_features = X_train[np.where(y_train_cls == 0)[0]]
        
        print("🔬 Statistical Analysis of Flood Conditions:")
        print("-" * 60)
        
        for i, name in enumerate(dataset["feature_names"]):
            flood_mean = flood_features[:, i].mean()
            normal_mean = normal_features[:, i].mean()
            ratio = flood_mean / (normal_mean + 0.001)
            
            if ratio > 1.5 or ratio < 0.67:
                indicator = "📈" if ratio > 1 else "📉"
                print(f"   {indicator} {name}:")
                print(f"      During floods: {flood_mean:.1f}")
                print(f"      Normal times: {normal_mean:.1f}")
                print(f"      Ratio: {ratio:.2f}x")
        
        # Key pattern
        flood_rain_3d = flood_features[:, 2].mean()  # rainfall_3day_sum
        print(f"\n💡 KEY PATTERN DISCOVERED:")
        print(f"   Floods typically occur when 3-day rainfall exceeds {flood_rain_3d:.0f}mm")
        print(f"   Combined with river level > {INDIA_RIVERS[river_id]['warning_level']}m")
        
        results["patterns"] = {
            "critical_rainfall_3d": flood_rain_3d,
            "insight": f"Floods occur when >={flood_rain_3d:.0f}mm rainfall accumulates over 3 days"
        }
    
    # =========================================================================
    # STEP 7: Interactive Demo Prediction
    # =========================================================================
    print_header("STEP 7: Interactive Prediction Demo")
    
    # Scenario 1: High risk
    print("🔴 Scenario 1: Heavy Monsoon (High Risk)")
    high_risk_features = {
        "rainfall_today": 120,
        "rainfall_2day_sum": 200,
        "rainfall_3day_sum": 280,
        "rainfall_week_avg": 60,
        "rainfall_week_max": 150,
        "prev_river_level": 90,
        "level_change_rate": 8,
        "soil_saturation_proxy": 70,
        "days_since_heavy_rain": 0,
    }
    high_result = rf_classifier.predict_single(high_risk_features)
    print(f"   Input: 280mm rain over 3 days, river at 90m")
    print(f"   Prediction: {high_result['prediction']}")
    print(f"   Probability: {high_result['probability']:.1%}")
    print(f"   Risk Level: {high_result['risk_level']}")
    print(f"   Explanation: {high_result['explanation']}")
    
    # Scenario 2: Low risk
    print("\n🟢 Scenario 2: Normal Conditions (Low Risk)")
    low_risk_features = {
        "rainfall_today": 20,
        "rainfall_2day_sum": 40,
        "rainfall_3day_sum": 60,
        "rainfall_week_avg": 15,
        "rainfall_week_max": 30,
        "prev_river_level": 50,
        "level_change_rate": 1,
        "soil_saturation_proxy": 20,
        "days_since_heavy_rain": 5,
    }
    low_result = rf_classifier.predict_single(low_risk_features)
    print(f"   Input: 60mm rain over 3 days, river at 50m")
    print(f"   Prediction: {low_result['prediction']}")
    print(f"   Probability: {low_result['probability']:.1%}")
    print(f"   Risk Level: {low_result['risk_level']}")
    print(f"   Explanation: {low_result['explanation']}")
    
    # =========================================================================
    # STEP 8: Save Results
    # =========================================================================
    print_header("STEP 8: Training Complete!")
    
    # Save results
    results_path = f"backend/models/training_results_{river_id}.json"
    with open(results_path, "w") as f:
        json.dump(results, f, indent=2, default=str)
    print(f"📁 Results saved to: {results_path}")
    
    # Summary
    print("\n" + "=" * 70)
    print("  TRAINING SUMMARY")
    print("=" * 70)
    print(f"""
    River: {results['river_name']}
    Training Data: {results['data_generation']['train_samples']} samples
    
    Random Forest Classifier:
    ├── Accuracy: {results['random_forest']['accuracy']:.1%}
    ├── F1 Score: {results['random_forest']['f1_score']:.1%}
    ├── Precision: {results['random_forest']['precision']:.1%}
    └── Recall: {results['random_forest']['recall']:.1%}
    
    Top Predictive Features:
    """)
    for i, (feat, imp) in enumerate(list(results['random_forest']['feature_importance'].items())[:3]):
        print(f"    {i+1}. {feat}: {imp:.1%}")
    
    if results.get("lstm", {}).get("trained"):
        print(f"""
    LSTM Time-Series Model:
    ├── Train MAE: {results['lstm']['train_mae']:.3f}m
    └── Val MAE: {results['lstm']['val_mae']:.3f}m
        """)
    
    print(f"""
    Key Pattern Discovered:
    └── {results.get('patterns', {}).get('insight', 'Heavy rainfall over 3+ days triggers flooding')}
    
    Models saved to: backend/models/
    """)
    
    # =========================================================================
    # STEP 9: Visualization (Optional)
    # =========================================================================
    if show_plots:
        print("\n📊 Generating visualizations...")
        try:
            create_visualizations(dataset, rf_metrics, river_id)
        except Exception as e:
            print(f"⚠️ Could not create visualizations: {e}")
    
    return results


def create_visualizations(dataset: Dict, rf_metrics: Dict, river_id: str):
    """Create and save visualization plots."""
    import matplotlib.pyplot as plt
    
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle(f'Flood Forecasting Analysis - {INDIA_RIVERS[river_id]["name"]}', fontsize=14, fontweight='bold')
    
    # Plot 1: Time series
    ax1 = axes[0, 0]
    ts = dataset["full_timeseries"]
    dates = range(len(ts))
    ax1.plot(dates, ts["river_level_m"], 'b-', alpha=0.7, label='River Level')
    ax1.axhline(y=INDIA_RIVERS[river_id]["danger_level"], color='r', linestyle='--', label='Danger Level')
    ax1.axhline(y=INDIA_RIVERS[river_id]["warning_level"], color='orange', linestyle='--', label='Warning Level')
    
    # Highlight flood periods
    flood_mask = ts["is_flood"] == 1
    ax1.fill_between(dates, ts["river_level_m"], where=flood_mask, alpha=0.3, color='red', label='Flood Events')
    
    ax1.set_xlabel('Days')
    ax1.set_ylabel('River Level (m)')
    ax1.set_title('River Level Time Series with Flood Events')
    ax1.legend(loc='upper right')
    ax1.grid(True, alpha=0.3)
    
    # Plot 2: Feature importance
    ax2 = axes[0, 1]
    features = list(rf_metrics["feature_importance"].keys())[:7]
    importance = [rf_metrics["feature_importance"][f] for f in features]
    colors = plt.cm.Blues(np.linspace(0.3, 0.9, len(features)))[::-1]
    
    bars = ax2.barh(features, importance, color=colors)
    ax2.set_xlabel('Importance')
    ax2.set_title('Feature Importance (Random Forest)')
    ax2.grid(True, alpha=0.3, axis='x')
    
    # Add values on bars
    for bar, imp in zip(bars, importance):
        ax2.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height()/2, 
                f'{imp:.2f}', va='center', fontsize=9)
    
    # Plot 3: Rainfall vs River Level scatter
    ax3 = axes[1, 0]
    rainfall_3d = dataset["X_train"][:, 2]  # rainfall_3day_sum
    river_level = dataset["y_train_regression"]
    flood = dataset["y_train_classification"]
    
    scatter = ax3.scatter(rainfall_3d, river_level, c=flood, cmap='RdYlGn_r', alpha=0.5, s=20)
    ax3.axhline(y=INDIA_RIVERS[river_id]["danger_level"], color='r', linestyle='--', linewidth=2)
    ax3.set_xlabel('3-Day Rainfall Sum (mm)')
    ax3.set_ylabel('Next Day River Level (m)')
    ax3.set_title('Rainfall vs River Level (colored by flood risk)')
    ax3.grid(True, alpha=0.3)
    plt.colorbar(scatter, ax=ax3, label='Flood (1) / Safe (0)')
    
    # Plot 4: Confusion matrix
    ax4 = axes[1, 1]
    cm = np.array(rf_metrics["confusion_matrix"])
    im = ax4.imshow(cm, cmap='Blues')
    
    # Add text annotations
    for i in range(2):
        for j in range(2):
            text = ax4.text(j, i, cm[i, j], ha="center", va="center", color="white" if cm[i, j] > cm.max()/2 else "black", fontsize=14)
    
    ax4.set_xticks([0, 1])
    ax4.set_yticks([0, 1])
    ax4.set_xticklabels(['Predicted Safe', 'Predicted Flood'])
    ax4.set_yticklabels(['Actual Safe', 'Actual Flood'])
    ax4.set_title('Confusion Matrix')
    plt.colorbar(im, ax=ax4)
    
    plt.tight_layout()
    
    # Save plot
    plot_path = f"backend/models/training_visualization_{river_id}.png"
    plt.savefig(plot_path, dpi=150, bbox_inches='tight')
    print(f"📊 Visualization saved to: {plot_path}")
    
    # Try to show
    try:
        plt.show()
    except:
        print("   (Could not display plot - running in non-GUI mode)")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Train flood forecasting models for hackathon demo"
    )
    parser.add_argument(
        "--river",
        choices=["cauvery", "vrishabhavathi", "brahmaputra"],
        default="cauvery",
        help="River to train on (default: cauvery)"
    )
    parser.add_argument(
        "--days",
        type=int,
        default=730,
        help="Days of data to simulate (default: 730 = 2 years)"
    )
    parser.add_argument(
        "--no-save",
        action="store_true",
        help="Don't save trained models"
    )
    parser.add_argument(
        "--no-plots",
        action="store_true",
        help="Don't show visualization plots"
    )
    
    args = parser.parse_args()
    
    print("\n" + "🌊" * 35)
    print("   RESCUE-PING: AI Flood Forecasting System")
    print("   Hackathon Training Pipeline")
    print("🌊" * 35)
    
    results = train_and_evaluate(
        river_id=args.river,
        num_days=args.days,
        save_models=not args.no_save,
        show_plots=not args.no_plots
    )
    
    print("\n✅ Training pipeline completed successfully!")
    print("   Run the backend server to test predictions via API:")
    print("   cd RescuePing && python backend/main.py")
    print("   Then visit: http://localhost:8000/docs")
    

if __name__ == "__main__":
    main()
